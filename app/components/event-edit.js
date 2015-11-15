import Ember from 'ember';
import style from '../utils/style';

const secondsInDay = 86400;

export default Ember.Component.extend({
  classNames:        [ 'event' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('event.secondsToday', 'event.temp', function() {
    // FIXME: Guess at these for the uninitialized.
    let elHeight     = 24;
    let parentHeight = 473;

    if (this.get('element')) {
      elHeight     = this.get('element').clientHeight;
      parentHeight = this.get('element').parentNode.clientHeight;
    }

    const seconds       = this.get('event.secondsToday');
    const dayProportion = seconds / secondsInDay;
    const top           = dayProportion * (parentHeight - elHeight);
    const topPart       = `top: ${top}px`;

    let styleString = style.addTempColours(
      this.get('element'),
      this.get('event.temp')
    ).string;

    return style.modifyString(styleString, topPart, 'top:');
  }),

  makeDraggable: Ember.on('didInsertElement', function() {
    const element = this.get('element');
    const parent  = element.parentNode;

    // FIXME: This is slightly off.
    const gridWidth  = parent.offsetWidth;
    const gridHeight = 1 / 24 / 60 * (parent.clientHeight - element.clientHeight);

    Ember.$(element).draggable({
      containment:    this.get('constraint'),
      grid:           [ gridWidth, gridHeight ],
      revert:         'invalid',
      revertDuration: 150,
      scope:          this.get('scope'),
      stack:          '.event',

      drag: this.updateTime.bind(this),
      stop: function(ev, ui) {
        this.updateDayAndTime(ev, ui);

        this.save();
      }.bind(this),
    });
  }),

  updateTime(ev, ui) {
    const dayProportion = ui.position.top / (ui.helper.parent().height() - ui.helper.height());

    const granularity = 5 * 60;

    let secondsToday = dayProportion * secondsInDay;
        secondsToday = Math.round(secondsToday / granularity) * granularity;
        secondsToday = Math.max(secondsToday, 0);
        secondsToday = Math.min(secondsToday, secondsInDay - granularity);

    this.set('event.secondsToday', secondsToday);
  },

  updateDayAndTime(ev, ui) {
    const dayChange = Math.round(ui.position.left / ui.helper.parent().width());

    this.incrementProperty('event.day', dayChange);

    this.updateTime(ev, ui);
  },

  save() {
    this.get('event').save();
  },

  actions: {
    remove() {
      this.get('event').deleteRecord();
    },

    save() {
      this.save();
    },

    copy() {
      this.sendAction('copyEvent', this.get('event'), this.get('event.day') + 1);
    },
  },
});
