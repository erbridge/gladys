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

  actions: {
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
