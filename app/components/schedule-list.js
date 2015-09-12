import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'schedules' ],

  childComponents: [],

  actions: {
    registerComponent(component) {
      this.get('childComponents').push(component);
    },

    createNewSchedule() {
      this.sendAction('createNewSchedule', this.get('list.schedules'));
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
  },
});
