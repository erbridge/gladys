import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    createNewSchedule() {
      this.sendAction('createNewSchedule', this.get('list').get('schedules'));
    },

    createNewEvent(events) {
      this.sendAction('createNewEvent', events);
    },
  },
});
