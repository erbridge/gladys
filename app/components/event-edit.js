import Ember from 'ember';

const secondsInDay = 86400;

export default Ember.Component.extend({
  classNames:        [ 'event' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('event.secondsToday', function() {
    // FIXME: Guess at these for the uninitialized.
    let elHeight     = 21;
    let parentHeight = 473;
    let styleString  = '';

    if (this.get('element')) {
      styleString  = this.get('element').getAttribute('style');
      elHeight     = this.get('element').clientHeight;
      parentHeight = this.get('element').parentNode.clientHeight;
    }

    const seconds       = this.get('event.secondsToday');
    const dayProportion = seconds / secondsInDay;
    const top           = dayProportion * (parentHeight - elHeight);
    const topPart       = `top: ${top}px`;

    if (!styleString) {
      styleString = `${topPart};`;
    } else if (styleString.indexOf('top:') < 0) {
      styleString = `${styleString}; ${topPart};`;
    } else {
      const inParts    = styleString.split(';');
      let outParts     = [];
      let topPartFound = false;

      _.each(inParts, function(part) {
        if (part.indexOf('top:') === -1) {
          outParts.push(part);
          return;
        }

        if (topPartFound) {
          return;
        }

        topPartFound = true;

        outParts.push(topPart);
      });

      if (!topPartFound) {
        outParts.push(topPart);
      }

      outParts = _.compact(outParts);

      styleString = outParts.join(';') + ';';
    }

    return new Ember.Handlebars.SafeString(styleString);
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
      stop: this.updateDayAndTime.bind(this),
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

  actions: {
    remove() {
      this.get('event').deleteRecord();
    },
  },
});
