import Ember from 'ember';
import style from '../utils/style';

export default Ember.Component.extend({
  classNames:        [ 'room' ],
  attributeBindings: [ 'allowEdits:editing' ],

  iconStyle: Ember.computed('room.temp', function() {
    return style.addTempColours(this.get('element'), this.get('room.temp'));
  }),

  allowEdits: false,

  register: Ember.on('didInsertElement', function() {
    this.sendAction('onInsert', this);
  }),

  actions: {
    onSelect() {
      this.sendAction('disallowAllEdits', this);

      this.toggleProperty('allowEdits');
    },

    createNewSchedule(schedules) {
      this.sendAction('createNewSchedule', schedules);
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },

    onScheduleSelect(schedule) {
      this.set('room.activeSchedule', schedule);

      this.get('room').save();
    },
  },
});
