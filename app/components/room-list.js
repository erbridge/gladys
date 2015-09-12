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
