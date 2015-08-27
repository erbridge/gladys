import Ember from 'ember';
import DS from 'ember-data';

const secondsInDay = 86400;
const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default DS.Model.extend({
  temp: DS.attr('number'),

  // Seconds since 00:00 Monday.
  seconds: DS.attr('number'),

  day: Ember.computed('seconds', function() {
    const dayIndex = Math.floor(this.get('seconds') / secondsInDay);

    return days[dayIndex];
  }),
});
