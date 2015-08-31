import Ember from 'ember';

const secondsInDay = 86400;

export default Ember.Component.extend({
  classNames: [ 'event' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('event.secondsToday', function() {
    const seconds = this.get('event').get('secondsToday');
    const top     = 100 * seconds / secondsInDay;

    return `top: ${top}%`;
  }),

  actions: {
    remove() {
      this.get('event').deleteRecord();
    },
  },
});
