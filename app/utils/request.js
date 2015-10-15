import Ember from 'ember';

const remoteUrl = 'http://192.168.1.31/cgi-bin/cmh/gladys_relay.sh/';

export default {
  send(data, dataType, retryCount=5) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const config = {
        type: 'GET',
        url:  remoteUrl,
        data: data,
      };

      if (dataType) {
        config.dataType = dataType;
      }

      console.log(data);

      const attemptSend = function() {
        Ember.$.ajax(config).then(function(data) {
          console.log('success');

          Ember.run(null, resolve, data);
        }, function(jqXHR) {
          console.log('error');

          if (retryCount > 0) {
            console.log('retrying');

            retryCount--;

            setTimeout(function() {
              attemptSend();
            }, 500);
          } else {
            console.log('rejecting');

            jqXHR.then = null;
            Ember.run(null, reject, jqXHR);
          }
        });
      };

      attemptSend();
    });
  }
};
