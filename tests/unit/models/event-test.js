import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('event', 'Unit | Model | event', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('first day is Monday', function(assert) {
  var model = this.subject({
    seconds: 0,
  });

  assert.equal(model.get('dayLabel'), 'monday');
});

test('setting the day does not change the time', function(assert) {
  var model = this.subject({
    seconds: 12345,
  });

  var time = model.get('time');

  Ember.run(function() {
    model.set('day', 3);
  });

  assert.equal(model.get('time'), time);
});
