import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'room' ],

  allowEdits: false,

  actions: {
    toggleEdit() {
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
