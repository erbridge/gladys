import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const store = this.store;

    const roomList = store.createRecord('room-list');
    const rooms    = roomList.get('rooms');

    // TODO: This comes from the remote.
    const names = [ 'Living Room', 'Bathroom' ];

    _.each(names, function(name) {
      store.query('room', { label: name }).then(function(matches) {
        if (!matches.get('length')) {
          rooms.pushObject(store.createRecord('room', { label: name }));
        } else {
          rooms.pushObjects(matches);
        }
      });
    });

    rooms.forEach(function(room) {
      room.save();
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
