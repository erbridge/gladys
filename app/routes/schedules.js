import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    var store = this.store;

    const list = store.createRecord('schedule-list');

    store.findAll('schedule').then(function(schedules) {
      const model = list.get('schedules');

      schedules.forEach(function(schedule) {
        model.pushObject(schedule);
      });
    });

    return list;
  },

  actions: {
    createNewSchedule(schedules) {
      const schedule = this.store.createRecord('schedule');
      schedule.save();

      schedules.addObject(schedule);
    },

    createNewEvent(events) {
      const event = this.store.createRecord('event');

      events.addObject(event);
    },
  },
});
