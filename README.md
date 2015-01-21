# Angular filter to convert text to XML to JSON

This module provides `text2xml` and `xml2js` filters for Angular. It uses the
browser's DOMParser (or XMLDOM ActiveX component in case of IE). There is no
dependency like X2JS.

## Installation

    bower install --save angular-xml2js

## XML JSON Example

For following XML document

    <?xml version="1.0"?>
    <a:propfind xmlns:a="DAV:">
      <a:prop>
        <a:getcontenttype/>
      </a:prop>
      <a:prop>
        <a:getcontentlength>4711</a:getcontentlength>
      </a:prop>
    </a:propfind>

the javascript object would be converted to

    {
      'propfind': {
        '@ns' {
          'prefix': 'a',
          'URI': 'DAV:'
        },
        '@attributes': {
          'a': {
            '@ns': {
              'prefix': 'xmlns',
              'URI': 'http://www.w3.org/2000/xmlns/'
            },
            'value': 'DAV:'
          }
        },
        'prop': [
          {
            '@ns': {
              'prefix': 'a',
              'URI': 'DAV:'
            },
            getcontenttype: {
              '@ns': {
                'prefix': 'a',
                'URI': 'DAV:'
              }
            }
          },
          {
            '@ns': {
              'prefix': 'a',
              'URI': 'DAV:'
            },
            getcontentlength: {
              '@ns': {
                'prefix': 'a',
                'URI': 'DAV:'
              },
              value: '4711'
            }
          }
        ]
      }
    }

You can access the value of `getcontentlength` like `propfind.prop[1].getcontentlength.value`.

## Text to XML Example

Following example shows how to convert a xml response to XML document:

    angular.module('app', ['xml2js'])
      .factory('service', [
        '$http',
        '$filter',
        function($http, $filter) {
          return {
            get: function(path) {
              return $http.get(path).then(function(response) {
                // check if response data is a XML document
                if (response.headers('Content-Type').match(/^\w+\/xml/)) {
                  var xml = $filter('text2xml')(response.data);

                  response.data = xml;
                }

                return response;
              });
            }
          }
        }
      ]);

## Text to XML to JS Example

Following example shows how to convert a xml response to javascript object:

    angular.module('app', ['xml2js'])
      .factory('service', [
        '$http',
        '$filter',
        function($http, $filter) {
          return {
            get: function(path) {
              return $http.get(path).then(function(response) {

                // check if response data is a XML document
                if (response.headers('Content-Type').match(/^\w+\/xml/)) {

                  // convert response data to XML to javascript object
                  var xml = $filter('text2xml')(response.data),
                      json = $filter('xml2js')(xml);

                  response.data = json;
                }

                return response;
              });
            }
          }
        }
      ]);

## Test

Please install `karma-cli` and all dependencies via `npm install` and `bower install`.
Then run

    karma start

You might also set the `CHROME_BIN` environment variable.

## Contribute

- [Fork](https://github.com/xemle/angular-xml2js/fork) github repository
- Create a brunch
    - Fix a single bug
    - Write test
- Send push request

## Similar Projects

- [angular-xml](https://github.com/johngeorgewright/angular-xml) (uses [X2JS](https://code.google.com/p/x2js) library)

## Licence

MIT