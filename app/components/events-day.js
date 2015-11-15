import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'events-day' ],

  makeDroppable: Ember.on('didInsertElement', function() {
    Ember.$(this.get('element')).droppable({
      scope: this.get('scope'),
    });
  }),

  actions: {
    createNewEvent(day) {
      this.sendAction('createNewEvent', day);
    },

    copyEvent(event, day) {
      this.sendAction('copyEvent', event, day);
    },
  },
});
