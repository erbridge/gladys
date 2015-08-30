import DS from 'ember-data';

export default DS.Model.extend({
  rooms: DS.hasMany('room', { async: false }),
});
