import DS from 'ember-data';

export default DS.Model.extend({
  label:          DS.attr('string'),
  activeSchedule: DS.belongsTo('schedule', { async: true }),
  devices:        DS.hasMany('device', { async: true }),
});
