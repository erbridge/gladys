import Ember from 'ember';

const isDayEvent = function(day) {
  return function(event) {
    return event.get('day') === day;
  };
};

export default Ember.Component.extend({
  mondayEvents:    Ember.computed.filter('schedule.events.@each.day', isDayEvent(0)),
  tuesdayEvents:   Ember.computed.filter('schedule.events.@each.day', isDayEvent(1)),
  wednesdayEvents: Ember.computed.filter('schedule.events.@each.day', isDayEvent(2)),
  thursdayEvents:  Ember.computed.filter('schedule.events.@each.day', isDayEvent(3)),
  fridayEvents:    Ember.computed.filter('schedule.events.@each.day', isDayEvent(4)),
  saturdayEvents:  Ember.computed.filter('schedule.events.@each.day', isDayEvent(5)),
  sundayEvents:    Ember.computed.filter('schedule.events.@each.day', isDayEvent(6)),

  scope: Ember.computed('day', function() {
    const id = this.get('schedule.id');

    return `schedule-${id}`;
  }),

  allowEdits: false,

  actions: {
    edit() {
      this.set('allowEdits', true);
    },

    done() {
      this.set('allowEdits', false);
    },

    save() {
      this.get('schedule').get('events').forEach(function(event) {
        event.save();
      });

      this.get('schedule').save();
    },

    remove() {
      this.get('schedule').destroyRecord();
    },

    createNewEvent(day) {
      this.sendAction('createNewEvent', this.get('schedule').get('events'), day);
    },
  },
});
