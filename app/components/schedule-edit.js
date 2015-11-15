import Ember from 'ember';

const isDayEvent = function(day) {
  return function(event) {
    return event.get('day') === day;
  };
};

export default Ember.Component.extend({
  classNames:        [ 'schedule' ],
  attributeBindings: [ 'allowEdits:editing', 'isActiveSchedule:highlighted' ],

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

  isActiveSchedule: Ember.computed('schedule', 'activeSchedule', function() {
    var schedule       = this.get('schedule');
    var activeSchedule = this.get('activeSchedule');

    if (schedule && activeSchedule) {
      return schedule.get('id') === activeSchedule.get('id');
    }

    if (!activeSchedule) {
      return false;
    }

    return false;
  }),

  allowEdits: false,

  register: Ember.on('didInsertElement', function() {
    this.sendAction('onInsert', this);
  }),

  actions: {
    onSelect() {
      this.sendAction('onSelect', this.get('schedule'));

      this.sendAction('disallowAllEdits', this);

      this.toggleProperty('allowEdits');
    },

    set() {
      this.sendAction('onSet', this.get('schedule'));
    },

    save() {
      this.get('schedule').save();
    },

    destroy() {
      this.get('schedule').destroyRecord();
    },

    createNewEvent(day) {
      this.sendAction('createNewEvent', this.get('schedule.events'), day);

      this.get('schedule').save();
    },

    copyEvent(event, day) {
      this.sendAction('copyEvent', this.get('schedule.events'), event, day);

      this.get('schedule').save();
    },
  },
});
