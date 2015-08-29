import DS from 'ember-data';

export default DS.Model.extend({
  label:          DS.attr('string'),
  currentTemp:    DS.attr('number'),
  setTemp:        DS.attr('number'),
  activeSchedule: DS.belongsTo('schedule', { async: true }),
});
