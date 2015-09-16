import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  label:  DS.attr('string', { defaultValue: 'untitled' }),
  events: DS.hasMany('event', { async: true }),
  rooms:  DS.hasMany('room', { async: true }),

  sortedEvents: Ember.computed('events.@each.seconds', function() {
    return this.get('events').sortBy('seconds');
  }),
});
