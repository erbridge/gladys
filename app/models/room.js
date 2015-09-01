import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  label:          DS.attr('string', { readOnly: true }),
  activeSchedule: DS.belongsTo('schedule', { async: true }),
  devices:        DS.hasMany('device', { async: true }),

  relays: Ember.computed.filter('devices.@each.type', function(device) {
    return device.get('type') === 'relay';
  }),

  thermostats: Ember.computed.filter('devices.@each.type', function(device) {
    return device.get('type') === 'thermostat';
  }),

  temp: Ember.computed('thermostats.@each.label', 'thermostats.@each.temp', function() {
    let temp;

    this.get('thermostats').forEach(function(device) {
      if (device.get('label').indexOf('Thermostat') !== -1) {
        temp = device.get('temp');
      }
    });

    return temp;
  }),
});
