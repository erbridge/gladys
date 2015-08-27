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

    set(key, day) {
      day = day % days.length;

      if (day < 0) {
        day += days.length;
      }

      const newDayOffset     = day * secondsInDay;
      const oldDayOffset     = this.get('day') * secondsInDay;
      const secondsRemaining = this.get('seconds') - oldDayOffset;

      this.set('seconds', newDayOffset + secondsRemaining);

      return day;
    },
  }),

  dayLabel: Ember.computed('day', {
    get() {
      return days[this.get('day')];
    },

    set(key, dayLabel) {
      this.set('day', days.indexOf(dayLabel));

      return dayLabel;
    },
  }),

  time: Ember.computed('seconds', 'day', {
    get() {
      const dayOffset = this.get('day') * secondsInDay;
      const seconds   = this.get('seconds') - dayOffset;

      const time = moment({ hours: 0 }).seconds(seconds);

      return time.format('HH:mm');
    },

    set(key, time) {
      const duration = moment.duration(time);

      this.set('seconds', duration.asSeconds());

      return time;
    },
  }),
});
