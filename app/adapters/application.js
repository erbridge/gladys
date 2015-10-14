import Ember from 'ember';
import DS from 'ember-data';
import request from '../utils/request';

const database  = {};

const remoteMap = {
  'gladys@model:schedule-list:': {
    type: 'schedule-lists',
    skip: true,
  },
  'gladys@model:schedule:': {
    type: 'schedules',
    flattenDown: {
      events: 'gladys@model:event:',
    },
  },
  'gladys@model:event:': {
    type:       'events',
    sendParent: 'gladys@model:schedule:',
  },
  'gladys@model:room-list:': {
    type: 'room-lists',
    skip: true,
  },
  'gladys@model:room:': {
    type: 'rooms',
  },
  'gladys@model:device:': {
    type: 'devices',
  },
};

const requestQueue = [];
let requestInProgress = false;

const clearRemote = function() {
  const data = {
    op: 'clear',
  };

  return request.send(data);
};

const saveRemote = function(remoteType) {
  const data = {
    op:   'save',
    name: remoteType,
  };

  return request.send(data);
};

const flattenData = function(data, remoteConfig) {
  const rawData = _.clone(data);

  if (remoteConfig.flattenDown) {
    _.each(rawData, function(datum, id) {
      datum = _.clone(datum);
      rawData[id] = datum;

      _.each(remoteConfig.flattenDown, function(type, key) {
        if (!datum[key]) {
          return;
        }

        if (!database[type]) {
          database[type] = {};
        }

        datum[key] = _.clone(datum[key]);

        _.each(datum[key], function(id, j) {
          const newValue = database[type][id];

          datum[key][j] = newValue;
        });
      });
    });
  }

  return rawData;
};

const inflateData = function(data, localType) {
  const remoteConfig = remoteMap[localType];

  if (!database[localType]) {
    database[localType] = {};
  }

  _.each(data, function(datum) {
    _.each(remoteConfig.flattenDown, function(type, key) {
      if (!database[type]) {
        database[type] = {};
      }

      _.each(datum[key], function(record, j) {
        const id = record.id;

        database[type][id] = record;

        datum[key][j] = id;
      });
    });

    database[localType][datum.id] = datum;
  });
};

const updateRemote = function(localType, retryCount=5) {
  const remoteConfig = remoteMap[localType];

  if (remoteConfig.skip) {
    return new Ember.RSVP.Promise(function(resolve) {
      resolve(_.values(database[localType]));
    });
  }

  if (remoteConfig.sendParent) {
    return updateRemote(remoteConfig.sendParent);
  }

  const sendChunks = function(dataString, totalSent, doneCallback) {
    const chunk     = dataString.slice(0, 4000);
    const remainder = dataString.slice(4000);

    totalSent += chunk.length;

    const data = {
      op:   'append',
      data: chunk,
    };

    const attemptSend = function() {
      request.send(data).then(function(resp) {
        if (parseInt(resp) !== totalSent) {
          console.log('bad response');

          if (retryCount > 0) {
            console.log('retrying');

            retryCount--;

            setTimeout(function() {
              attemptSend();
            }, 500);
          } else {
            console.log('rejecting');
          }

          return;
        }

        if (remainder) {
          sendChunks(remainder, totalSent, doneCallback);
        } else {
          doneCallback(totalSent);
        }
      });
    };

    attemptSend();
  };

  const remoteType = remoteMap[localType].type;
  const rawData    = flattenData(database[localType], remoteConfig);
  const dataString = JSON.stringify(_.values(rawData));

  return new Ember.RSVP.Promise(function(resolve, reject) {
    requestQueue.push(function() {
      requestInProgress = true;

      // FIXME: Check this is returning the right response.
      clearRemote().then(function() {
        sendChunks(dataString, 0, function() {
          // FIXME: Check this is returning the right response.
          saveRemote(remoteType).then(function() {
            requestInProgress = false;

            Ember.run(null, resolve, _.values(database[localType]));
          }, function(jqXHR) {
            requestInProgress = false;

            Ember.run(null, reject, jqXHR);
          });
        });
      }, function(jqXHR) {
        requestInProgress = false;

        Ember.run(null, reject, jqXHR);
      });
    });
  });
};

const updateLocal = function(localType) {
  const remoteConfig = remoteMap[localType];

  if (remoteConfig.skip) {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run(null, resolve, _.values(database[localType]));
    });
  }

  if (remoteConfig.sendParent) {
    return updateLocal(remoteConfig.sendParent);
  }

  const params = {
    op:   'get',
    name: remoteConfig.type,
  };

  if (!database[localType]) {
    database[localType] = {};
  }

  return new Ember.RSVP.Promise(function(resolve, reject) {
    requestQueue.push(function() {
      requestInProgress = true;

      request.send(params, 'json').then(function(data) {
        inflateData(data || [], localType);

        requestInProgress = false;

        Ember.run(null, resolve, _.values(database[localType]));
      }, function(jqXHR) {
        Ember.run(null, reject, jqXHR);
      });
    });
  });
};

setInterval(function() {
  if (!requestInProgress && requestQueue.length) {
    requestQueue.shift()();
  }
}, 100);

export default DS.Adapter.extend({
  coalesceFindRequests: true,

  generateIdForRecord() {
    return cuid();
  },

  createRecord(store, type, snapshot) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    const localType = type.toString();

    if (!database[localType]) {
      database[localType] = {};
    }

    database[localType][snapshot.id] = data;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      updateRemote(localType).then(function() {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    const localType = type.toString();

    if (database[localType]) {
      delete database[localType][snapshot.id];
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      updateRemote(localType).then(function() {
        Ember.run(null, resolve, snapshot);
      }, function(jqXHR) {
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  findAll(store, type) {
    return updateLocal(type.toString());
  },

  findRecord(store, type, id) {
    const localType = type.toString();

    if (!database[localType]) {
      database[localType] = {};
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      updateLocal(localType).then(function() {
        Ember.run(null, resolve, database[localType][id]);
      }, function(jqXHR) {
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  query(store, type, query) {
    const localType = type.toString();

    return new Ember.RSVP.Promise(function(resolve, reject) {
      updateLocal(localType).then(function(data) {
        const records = [];

        _.each(data, function(record) {
          const isMatch = _.every(query, function(value, key) {
            return record[key] === value;
          });

          if (isMatch) {
            records.push(record);
          }
        });

        Ember.run(null, resolve, records);
      }, function(jqXHR) {
        Ember.run(null, reject, jqXHR);
      });
    });
  },
});
