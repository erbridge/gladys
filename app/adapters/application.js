import Ember from 'ember';
import DS from 'ember-data';

const remoteUrl = 'http://192.168.1.31:3480/data_request';
const database  = {};

const remoteMap = {
  'gladys@model:schedule-list:': {
    type: 'schedule-list',
  },
  'gladys@model:schedule:': {
    type: 'schedule',
    flattenDown: {
      events: 'gladys@model:event:',
    },
  },
  'gladys@model:event:': {
    type:       'event',
    sendParent: 'gladys@model:schedule:',
  },
};

const sendRequest = function(data) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    Ember.$.ajax({
      type: 'GET',
      url:  remoteUrl,
      data: data,
    }).then(function(data) {
      Ember.run(null, resolve, data);
    }, function(jqXHR) {
      jqXHR.then = null;
      Ember.run(null, reject, jqXHR);
    });
  });
};

const clearRemote = function(localType) {
  const data = {
    id:   'lr_scheduler',
    op:   'clear',
    name: localType,
  };

  return sendRequest(data);
};

const saveRemote = function(localType) {
  const data = {
    id:   'lr_scheduler',
    op:   'save',
    name: localType,
  };

  return sendRequest(data);
};

const updateRemote = function(localType) {
  const remoteConfig = remoteMap[localType];

  if (remoteConfig.sendParent) {
    return updateRemote(remoteConfig.sendParent);
  }

  const rawData = _.clone(database[localType]);

  if (remoteConfig.flattenDown) {
    _.each(rawData, function(datum, id) {
      datum = _.clone(datum);
      rawData[id] = datum;

      _.each(remoteConfig.flattenDown, function(type, key) {
        if (!datum[key]) {
          return;
        }

        datum[key] = _.clone(datum[key]);

        _.each(datum[key], function(id, j) {
          const newValue = database[type][id];

          datum[key][j] = newValue;
        });
      });
    });
  }

  const remoteType = remoteMap[localType].type;

  const data = {
    id:   'lr_scheduler',
    op:   'append',

    // TODO: Split into 5000 character chunks.
    data: _.values(rawData),
  };

  // FIXME: This doesn't return the right promise.
  return clearRemote(remoteType).then(function() {
    sendRequest(data).then(function() {
      saveRemote(remoteType);
    });
  });
};

const updateLocal = function() {
  // TODO: Get the remote data and overwrite the existing data with it.
};

export default DS.Adapter.extend({
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

    return updateRemote(localType);
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    const localType = type.toString();

    if (database[localType]) {
      delete database[localType][snapshot.id];
    }

    // TODO: Don't update if the data hasn't changed?
    return updateRemote(localType);
  },

  // TODO
  findRecord() {

  },

  // TODO
  findAll() {

  },

  // TODO
  query() {

  },
});
