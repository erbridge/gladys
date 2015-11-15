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

export default DS.Model.extend(Ember.Copyable, {
  temp: DS.attr('number', {
    defaultValue: 18,
  }),

  // Seconds since 00:00 Monday.
  seconds: DS.attr('number', {
    defaultValue: 0,
  }),

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

  secondsToday: Ember.computed('seconds', 'day', {
    get() {
      const dayOffset    = this.get('day') * secondsInDay;
      const secondsToday = this.get('seconds') - dayOffset;

      return secondsToday;
    },

    set(key, secondsToday) {
      const dayOffset = this.get('day') * secondsInDay;
      const seconds   = secondsToday + dayOffset;

      this.set('seconds', seconds);

      return secondsToday;
    },
  }),

  time: Ember.computed('secondsToday', {
    get() {
      const time = moment({ hours: 0 }).seconds(this.get('secondsToday'));

      return time.format('HH:mm');
    },

    set(key, time) {
      const duration = moment.duration(time);

      this.set('secondsToday', duration.asSeconds());

      return time;
    },
  }),

  copy() {
    return this.store.createRecord('event', {
      temp:    this.get('temp'),
      seconds: this.get('seconds'),
    });
  }
});
