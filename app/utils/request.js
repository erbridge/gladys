import Ember from 'ember';

const remoteUrl = 'http://192.168.1.31/cgi-bin/cmh/gladys_relay.sh/';

export default {
  send(data, dataType) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var config = {
        type: 'GET',
        url:  remoteUrl,
        data: data,
      };

      if (dataType) {
        config.dataType = dataType;
      }

      console.log(data);
      console.log(config);

      Ember.$.ajax(config).then(function(data) {
        console.log(data);

        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        console.log('error');
        console.log(jqXHR);

        jqXHR.then = null;
        Ember.run(null, reject, jqXHR);
      });
    });
  }
};
