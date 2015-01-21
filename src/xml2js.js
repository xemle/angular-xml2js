angular.module('xml2js')
  .filter('xml2js', [
    function() {

      // constants
      var NODE = 1,
          TEXT = 3,
          ATTRIBUTES_NAME = '@attributes',
          NAMESPACE_NAME = '@ns';

      function getNodeName(node) {
        if (node.nodeType === TEXT) {
          return 'value';
        }
        return node.localName || node.nodeName;
      }

      // based from http://davidwalsh.name/convert-xml-json
      // Changes XML to JSON
      function xmlToJs(xml) {

        // Create the return object
        var obj = {},
            attribute,
            item,
            name;

        if (xml.prefix) {
          obj[NAMESPACE_NAME] = {
            prefix: xml.prefix,
            URI: xml.namespaceURI
          };
        }
        if (xml.nodeType === NODE) { // element
          // do attributes
          if (xml.attributes.length > 0) {
            obj[ATTRIBUTES_NAME] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
              attribute = xml.attributes.item(j);

              obj[ATTRIBUTES_NAME][getNodeName(attribute)] = xmlToJs(attribute);
            }
          }
        } else if (xml.nodeType === TEXT) { // text
          return xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
          for(var i = 0; i < xml.childNodes.length; i++) {
            item = xml.childNodes.item(i);
            name = getNodeName(item);

            if (angular.isUndefined(obj[name])) {
              obj[name] = xmlToJs(item);
            } else {
              if (!angular.isArray(obj[name])) {
                var old = obj[name];
                obj[name] = [];
                obj[name].push(old);
              }
              obj[name].push(xmlToJs(item));
            }
          }
        }
        return obj;
      }

      return function(input) {
        return xmlToJs(input);
      };
    }
  ]);
