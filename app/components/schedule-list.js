import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    createNewSchedule() {
      this.sendAction('createNewSchedule', this.get('list').get('schedules'));
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },
  },
});
