import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      this.schedule.save();
    },

    remove() {
      this.schedule.destroyRecord();
    },

    createNewEvent() {
      this.sendAction('createNewEvent', this.schedule.get('events'));
    },
  },
});
