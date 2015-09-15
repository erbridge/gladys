import Ember from 'ember';
import style from '../utils/style';

export default Ember.Component.extend({
  classNames:        [ 'device' ],
  attributeBindings: [ 'style' ],

  style: Ember.computed('device.temp', function() {
    if (_.isNumber(this.get('device.temp'))) {
      return style.addTempColours(this.get('element'), this.get('device.temp'));
    }

    let styleString = '';

    if (this.get('element')) {
      styleString = this.get('element').getAttribute('style');
    }

    return new Ember.Handlebars.SafeString(styleString);
  }),
});
