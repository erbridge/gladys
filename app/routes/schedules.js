import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // TODO: Get this stuff the remote.
    const list = this.store.createRecord('schedule-list');

    list.save();

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
