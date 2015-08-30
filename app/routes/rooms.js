import Ember from 'ember';
import request from '../utils/request';

export default Ember.Route.extend({
  model() {
    const store = this.store;

    const roomList = store.createRecord('room-list');
    const rooms    = roomList.get('rooms');

    request.send({ op: 'rooms' }, 'json').then(function(rawRooms) {
      _.each(rawRooms, function(rawRoom, roomName) {
        store.query('room', { label: roomName }).then(function(matches) {
          let room;

          if (!matches.get('length')) {
            room = store.createRecord('room', { label: roomName });
          } else {
            // FIXME: Should we really be doing this?
            //        Duplicates shouldn't be introduced.
            //        Use the roomName as the ID?
            matches.forEach(function(matchedRoom) {
              if (!room) {
                room = matchedRoom;
              } else {
                // Remove duplicates.
                matchedRoom.destroyRecord();
              }
            });
          }

          rooms.pushObject(room);

          const devices = room.get('devices');

          // FIXME: Don't always recreate it?
          devices.clear();

          _.each(rawRoom, function(rawDevice, deviceName) {
            store.query('device', { label: deviceName }).then(function(deviceMatches) {
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
                // FIXME: Should we really be doing this?
                //        Duplicates shouldn't be introduced.
                //        Use the deviceName as the ID?
                matches.forEach(function(matchedDevice) {
                  if (!device) {
                    device = matchedDevice;
                  } else {
                    // Remove duplicates.
                    matchedDevice.destroyRecord();
                  }
                });
              }

              devices.pushObject(device);

              room.save();
            });
          });
        });
      });
    });

    const scheduleList = store.createRecord('schedule-list');
    const schedules    = scheduleList.get('schedules');

    store.findAll('schedule').then(function(matches) {
      matches.forEach(function(schedule) {
        schedules.pushObject(schedule);
      });
    });

    return {
      roomList:     roomList,
      scheduleList: scheduleList,
    };
  },
});
