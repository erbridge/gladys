import Ember from 'ember';

// TODO: Get this from the remote.
const schedules = [
  {
    name: 'bedroom',
  },
];

export default Ember.Route.extend({
  model() {
    return schedules;
  },
});
