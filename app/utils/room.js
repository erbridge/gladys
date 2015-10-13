import request from '../utils/request';

const updateDevices = function(store, devices, rawDevices, callback) {
  // Make sure we don't list any removed devices.
  devices.clear();

  let queryCount = _.keys(rawDevices).length;

  _.each(rawDevices, function(rawDevice, deviceName) {
    store.query('device', { label: deviceName, type: rawDevice.type }).then(function(deviceMatches) {
      let device;

      if (!deviceMatches.get('length')) {
        device = store.createRecord('device', {
          label:    deviceName,
          type:     rawDevice.type,
          state:    rawDevice.state,
          temp:     rawDevice.temperature,
          setPoint: rawDevice.setpoint,
        });

        device.save();
      } else {
        device = deviceMatches.get('firstObject');

        device.setProperties({
          state:    rawDevice.state,
          temp:     rawDevice.temperature,
          setPoint: rawDevice.setpoint,
        });

        device.save();
      }

      devices.pushObject(device);

      queryCount--;

      if (!queryCount) {
        callback();
      }
    });
  });
};

const findOrCreateRoom = function(store, label, callback) {
  store.query('room', { label: label }).then(function(roomMatches) {
    let room;

    if (!roomMatches.get('length')) {
      room = store.createRecord('room', { label: label });
    } else {
      room = roomMatches.get('firstObject');
    }

    callback(room);
  });
};

export default {
  populate(store, rooms) {
    request.send({ op: 'rooms' }, 'json').then(function(rawRooms) {
      _.each(rawRooms, function(rawDevices, roomName) {
        findOrCreateRoom(store, roomName, function(room) {
          updateDevices(store, room.get('devices'), rawDevices, function() {
            rooms.pushObject(room);

            room.save();
          });
        });
      });
    });
  },
};
