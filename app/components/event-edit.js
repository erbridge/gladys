import Ember from 'ember';

const secondsInDay = 86400;

export default Ember.Component.extend({
  classNames:        [ 'event' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('event.secondsToday', function() {
    const seconds = this.get('event').get('secondsToday');

    // FIXME: Account for the element height.
    const top = 100 * seconds / secondsInDay;

    return new Ember.Handlebars.SafeString(`top: ${top}%;`);
  }),

  makeDraggable: Ember.on('didInsertElement', function() {
    Ember.$(this.element).draggable({
      axis:        'y',
      containment: 'parent',
      drag:        this.updateTime.bind(this),
    });
  }),

  updateTime(ev, ui) {
    const dayProportion = ui.position.top / ui.helper.parent().height();

    this.get('event').set('secondsToday', Math.round(dayProportion * secondsInDay));
  },

  actions: {
    remove() {
      this.get('event').deleteRecord();
    },
  },
});
