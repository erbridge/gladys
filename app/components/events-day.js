import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'events-day' ],

  actions: {
    createNewEvent(day) {
      this.sendAction('createNewEvent', day);
    },
  },
});
