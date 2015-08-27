import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // TODO: Get this stuff the remote.

    const store = this.store;

    const events = [
      store.createRecord('event', {
        temp:    10,
        seconds: 1000,
      }),
      store.createRecord('event', {
        temp:    15,
        seconds: 1300,
      }),
    ];

    return [
      store.createRecord('schedule', {
        label:  'bedroom',
        events: events,
      }),
    ];
  },

  actions: {
    createNewEvent(events) {
      const event = this.store.createRecord('event');

      events.addObject(event);
    },
  },
});
