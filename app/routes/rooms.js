import Ember from 'ember';
import room from '../utils/room';

export default Ember.Route.extend({
  model() {
    const store = this.store;

    const roomList = store.createRecord('room-list');

    room.populate(store, roomList.get('rooms'));

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

  actions: {
    createNewSchedule(schedules) {
      const schedule = this.store.createRecord('schedule');

      schedule.save();

      schedules.addObject(schedule);
    },

    createNewEvent(events, day) {
      const event = this.store.createRecord('event');

      event.set('day', day);
      event.save();

      events.addObject(event);
    },

    copyEvent(events, event, day) {
      const newEvent = event.copy();

      newEvent.set('day', day);
      newEvent.save();

      events.addObject(newEvent);
    },
  },
});
