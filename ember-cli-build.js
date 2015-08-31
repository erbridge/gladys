/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/cuid/dist/browser-cuid.js');

  app.import({
    development: 'bower_components/moment/moment.js',
    production:  'bower_components/moment/min/moment.min.js',
  });

  app.import({
    development: 'bower_components/underscore/underscore.js',
    production:  'bower_components/underscore/underscore-min.js',
  });

  app.import({
    development: 'bower_components/jquery-ui/jquery-ui.js',
    production:  'bower_components/jquery-ui/jquery-ui.min.js',
  });

  app.import({
    development: 'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
    production:  'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
  });

  return app.toTree();
};
