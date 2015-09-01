import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'rooms' ],

  actions: {
    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },
  },
});
