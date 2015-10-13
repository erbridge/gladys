import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'rooms' ],

  childComponents: [],

  actions: {
    registerComponent(component) {
      this.get('childComponents').push(component);
    },

    unregisterComponent(component) {
      this.get('childComponents').remove(component);
    },

    createNewSchedule(schedules) {
      this.sendAction('createNewSchedule', schedules);
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },

    disallowAllEdits(componentToSkip) {
      this.get('childComponents').forEach(function(component) {
        if (component === componentToSkip) {
          return;
        }

        if (component.isDestroying) {
          return;
        }

        component.set('allowEdits', false);
      });
    },

    setEditedSchedule(schedule) {
      this.set('editedSchedule', schedule);
    },
  },
});
