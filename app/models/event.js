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

  day: Ember.computed('seconds', {
    get() {
      return Math.floor(this.get('seconds') / secondsInDay);
    },

    set(key, value) {
      const newDayOffset     = value * secondsInDay;
      const oldDayOffset     = this.get('day') * secondsInDay;
      const secondsRemaining = this.get('seconds') - oldDayOffset;

      this.set('seconds', newDayOffset + secondsRemaining);
    },
  }),

  dayLabel: Ember.computed('day', {
    get() {
      return days[this.get('day')];
    },

    set(key, value) {
      this.set('day', days.indexOf(value));
    },
  }),

  timeLabel: Ember.computed('seconds', 'day', {
    get() {
      const dayOffset = this.get('day') * secondsInDay;
      const seconds   = this.get('seconds') - dayOffset;

      const time = moment({ hours: 0 }).seconds(seconds);

      return time.format('HH:mm');
    },

    set(key, value) {
      const time = moment.duration(value);

      this.set('seconds', time.asSeconds());
    },
  }),
});
