import Ember from 'ember';
import request from '../utils/request';

export default Ember.Route.extend({
  model() {
    const store = this.store;

    const roomList = store.createRecord('room-list');
    const rooms    = roomList.get('rooms');

    request.send({ op: 'rooms' }, 'json').then(function(rawRooms) {
      _.each(rawRooms, function(rawRoom, name) {
        // FIXME: Something odd happens with spaces being replaced by +es,
        //        so force it here.
        name = name.replace(' ', '+');

        store.query('room', { label: name }).then(function(matches) {
          if (!matches.get('length')) {
            rooms.pushObject(store.createRecord('room', { label: name }));
          } else {
            let match;

            // FIXME: Should we really be doing this?
            //        Duplicates shouldn't be introduced.
            //        Use the name as the ID?
            matches.forEach(function(matchedRoom) {
              if (!match) {
                match = matchedRoom;
              } else {
                // Remove duplicates.
                matchedRoom.destroyRecord();
              }
            });

            rooms.pushObject(match);
          }
        });
      });

      rooms.forEach(function(room) {
        room.save();
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
