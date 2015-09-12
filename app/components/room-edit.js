import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'room' ],

  allowEdits: false,

  register: Ember.on('didInsertElement', function() {
    this.sendAction('onInsert', this);
  }),

  actions: {
    toggleEdit() {
      this.sendAction('disallowAllEdits', this);

      this.toggleProperty('allowEdits');
    },

    save() {
      this.get('room').save();
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },
  },
});
