import { moduleForModel, test } from 'ember-qunit';

moduleForModel('schedule-list', 'Unit | Model | schedule list', {
  // Specify the other units that are required for this test.
  needs: ['model:schedule']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
