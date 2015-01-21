# Angular filter to convert text to XML to JSON

This module provides `textToXml` and `xmlToJson` filter for Angular. It uses the
browser's DOMParser (or XMLDOM ActiveX component in case of IE). There is no
dependency like X2JS.

## Installation

    bower install --save angular-xemle-xml

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

the JSON object would be

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

So you can access the value of `getcontentlength` like `propfind.prop[1].getcontentlength.value`.

## Text to XML Example

Following example shows how to convert a xml response to XML document:

    angular.module('app', ['xemle-xml'])
      .factory('service', [
        '$http',
        '$filter',
        function($http, $filter) {
          return {
            get: function(path) {
              return $http.get(path).then(function(response) {
                // check if response data is a XML document
                if (response.headers('Content-Type').test(/^\w+\/xml/)) {
                  var xml = $filter('textToXml')(response.data);

                  response.data = xml;
                }

                return response;
              });
            }
          }
        }
      ]);

## Text to XML to JSON Example

Following example shows how to convert a xml response to JSON object:

    angular.module('app', ['xemle-xml'])
      .factory('service', [
        '$http',
        '$filter',
        function($http, $filter) {
          return {
            get: function(path) {
              return $http.get(path).then(function(response) {

                // check if response data is a XML document
                if (response.headers('Content-Type').test(/^\w+\/xml/)) {

                  // convert response data to XML to JSON object
                  var xml = $filter('textToXml')(response.data),
                      json = $filter('xmlToJson')(xml);

                  response.data = json;
                }

                return response;
              });
            }
          }
        }
      ]);

## Contribute

- Fork github repository
- Create a brunch
    - Fix a single bug
    - Write test
- Send push request

## Similar Projects

- [angular-xml](https://github.com/johngeorgewright/angular-xml) (uses [X2JS](https://code.google.com/p/x2js) library)

## Licence

MIT