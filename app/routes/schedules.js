import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const store = this.store;

    const list  = store.createRecord('schedule-list');
    const model = list.get('schedules');

    store.findAll('schedule').then(function(schedules) {
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

    createNewEvent(events, day) {
      const event = this.store.createRecord('event');
      event.set('day', day);

      events.addObject(event);
    },
  },
});
