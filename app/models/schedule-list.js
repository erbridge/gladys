import DS from 'ember-data';

export default DS.Model.extend({
  schedules: DS.hasMany('schedule'),
});
