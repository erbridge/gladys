import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'room' ],

  allowEdits: false,

  actions: {
    edit() {
      this.set('allowEdits', true);
    },

    done() {
      this.set('allowEdits', false);
    },

    save() {
      this.get('room').save();
    },
  },
});
