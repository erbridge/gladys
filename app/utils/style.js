import Ember from 'ember';

export default {
  addTempColours(element, temp) {
    temp = Math.min(temp, 25);
    temp = Math.max(temp, 15);

    // 270 degrees at < 15C, 0 degrees at > 25C
    const hue = 270 * (25 - temp) / 10;

    return this.modifyAttribute(
      element,
      `background-color: hsl(${hue}, 50%, 50%)`,
      'background'
    );
  },

  modifyAttribute(element, property, propertyMatchString) {
    let styleString = '';

    if (element) {
      styleString = element.getAttribute('style');
    }

    return this.modifyString(styleString, property, propertyMatchString);
  },

  modifyString(styleString, property, propertyMatchString) {
    if (!styleString) {
      styleString = `${property};`;
    } else if (styleString.indexOf(propertyMatchString) < 0) {
      styleString = `${styleString}; ${property};`;
    } else {
      const inParts    = styleString.split(';');
      let outParts     = [];
      let propertyFound = false;

      _.each(inParts, function(part) {
        if (part.indexOf(propertyMatchString) < 0) {
          outParts.push(part);
          return;
        }

        if (propertyFound) {
          return;
        }

        propertyFound = true;

        outParts.push(property);
      });

      if (!propertyFound) {
        outParts.push(property);
      }

      outParts = _.compact(outParts);

      styleString = outParts.join(';') + ';';
    }

    return new Ember.Handlebars.SafeString(styleString);
  },
};
