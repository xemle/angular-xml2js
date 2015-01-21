angular.module('xml2js', [])
  .filter('text2xml', [
    '$window',
    '$log',
    function($window, $log) {
      return function(input) {

        var xml;

        if ('DOMParser' in $window) {
          var parser = new $window.DOMParser();
          try {
            xml = parser.parseFromString(input, 'text/xml');
          } catch (e) {
            $log.error('Could not parse input: ' + input);
            throw e;
          }
        } else if ('ActiveXObject' in $window) {
          xml = new $window.ActiveXObject('Microsoft.XMLDOM');
          if (!xml) {
            $log.error('Could not load Microsoft ActiveX XMLDOM');
            throw new Error('Could not load Microsoft ActiveX XMLDOM');
          } else {
            try {
              xml.async = false;
              xml.loadXML(input);
            } catch (e) {
              $log.error('Could not parse input: ' + input);
              throw e;
            }
          }
        } else {
          throw new Error('Your JS engine does not support a native DOM parser');
        }
        return xml;
      };
    }
  ]);
