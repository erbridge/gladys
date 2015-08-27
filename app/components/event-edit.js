import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      this.event.save();
    },

    remove() {
      this.event.destroyRecord();
    },
  },
});
