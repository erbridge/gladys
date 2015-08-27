import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  label:  DS.attr('string'),
  events: DS.hasMany('event'),

  sortedEvents: Ember.computed('events', 'events.@each.seconds', function() {
    return this.get('events').sortBy('seconds');
  }),
});
