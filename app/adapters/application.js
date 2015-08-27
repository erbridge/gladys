import Ember from 'ember';
import DS from 'ember-data';

const remoteUrl = 'http://192.168.1.31:3480/data_request';
const database  = {};

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

const clearRemote = function(typeString) {
  const data = {
    id:   'lr_scheduler',
    op:   'clear',
    name: typeString,
  };

  return sendRequest(data);
};

const saveRemote = function(typeString) {
  const data = {
    id:   'lr_scheduler',
    op:   'save',
    name: typeString,
  };

  return sendRequest(data);
};

const updateRemote = function(typeString) {
  // TODO: Split into 5000 character chunks.
  const json = JSON.stringify(database[typeString]);

  const data = {
    id:   'lr_scheduler',
    op:   'append',
    data: json,
  };

  // FIXME: This doesn't return the right promise.
  return clearRemote(typeString).then(function() {
    sendRequest(data).then(function() {
      saveRemote(typeString);
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

    serializer.serializeIntoHash(data, type, snapshot);

    const typeString = type.toString();

    if (!database[typeString]) {
      database[typeString] = {};
    }

    database[typeString][snapshot.id] = data;

    return updateRemote(typeString);
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    const typeString = type.toString();

    if (database[typeString]) {
      delete database[typeString][snapshot.id];
    }

    // TODO: Don't update if the data hasn't changed?
    return updateRemote(typeString);
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
