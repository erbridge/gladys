import Ember from 'ember';

export default Ember.Helper.helper(function([leftParam, rightParam]) {
  return leftParam === rightParam;
});
