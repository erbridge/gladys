import Ember from 'ember';
import style from '../utils/style';

export default Ember.Component.extend({
  classNames: [ 'room' ],

  iconStyle: Ember.computed('room.temp', function() {
    return style.addTempColours(this.get('element'), this.get('room.temp'));
  }),

  allowEdits: false,

  register: Ember.on('didInsertElement', function() {
    this.sendAction('onInsert', this);
  }),

  actions: {
    toggleEdit() {
      this.sendAction('disallowAllEdits', this);

      this.toggleProperty('allowEdits');
    },

    save() {
      this.get('room').save();
    },

    createNewEvent(events, day) {
      this.sendAction('createNewEvent', events, day);
    },
  },
});
