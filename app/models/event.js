import DS from 'ember-data';

export default DS.Model.extend({
  temp: DS.attr('number'),

  // Seconds since 00:00 Monday.
  seconds: DS.attr('number'),
});
