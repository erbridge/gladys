import Ember from 'ember';

const secondsInDay = 86400;

export default Ember.Component.extend({
  classNames:        [ 'event' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('event.secondsToday', function() {
    // Guess at these for the uninitialized.
    let elHeight     = 42;
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
    Ember.$(this.element).draggable({
      axis:        'y',
      containment: 'parent',
      drag:        this.updateTime.bind(this),
      stack:       '.event',
    });
  }),

  updateTime(ev, ui) {
    const dayProportion = ui.position.top / (ui.helper.parent().height() - ui.helper.height());

    this.set('event.secondsToday', Math.round(dayProportion * secondsInDay));
  },

  actions: {
    remove() {
      this.get('event').deleteRecord();
    },

    increaseDay() {
      this.incrementProperty('event.day');
    },

    decreaseDay() {
      this.decrementProperty('event.day');
    },
  },
});
