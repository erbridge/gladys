import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    createNewEvent() {
      this.sendAction('createNewEvent', this.schedule);
    },
  },
});
