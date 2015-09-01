import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'schedules' ],

  actions: {
    createNewSchedule() {
      this.sendAction('createNewSchedule', this.get('list.schedules'));
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },
  },
});
