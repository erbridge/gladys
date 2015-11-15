import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'events-day' ],

  makeDroppable: Ember.on('didInsertElement', function() {
    Ember.$(this.get('element')).droppable({
      scope: this.get('scope'),
    });
  }),

  actions: {
    copy() {
      const day = this.get('day');

      this.sendAction('copyDay', day, day + 1);
    },

    createNewEvent() {
      this.sendAction('createNewEvent', this.get('day'));
    },

    copyEvent(event, day) {
      this.sendAction('copyEvent', event, day);
    },
  },
});
