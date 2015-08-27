import DS from 'ember-data';

export default DS.Model.extend({
  temp: DS.attr('number'),
  day:  DS.attr('number'),
  time: DS.attr('number'),
});
