import Ember from 'ember';
import style from '../utils/style';

export default Ember.Component.extend({
  classNames:        [ 'room' ],
  attributeBindings: [ 'allowEdits:editing', 'usesEditedSchedule:highlighted' ],

  iconStyle: Ember.computed('room.temp', function() {
    return style.addTempColours(this.get('element'), this.get('room.temp'));
  }),

  usesEditedSchedule: Ember.computed('room.activeSchedule', 'editedSchedule', function() {
    var activeSchedule = this.get('room.activeSchedule');
    var editedSchedule = this.get('editedSchedule');

    if (activeSchedule && editedSchedule) {
      return activeSchedule.get('id') === editedSchedule.get('id');
    }

    if (!editedSchedule) {
      return true;
    }

    return false;
  }),

  allowEdits: false,

  register: Ember.on('didInsertElement', function() {
    this.sendAction('onInsert', this);
  }),

  actions: {
    onSelect() {
      this.sendAction('onScheduleSelect', this.get('room.activeSchedule'));
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
      this.sendAction('onScheduleSelect', schedule);
    },

    onScheduleSet(schedule) {
      this.set('room.activeSchedule', schedule);

      this.get('room').save();
    },
  },
});
