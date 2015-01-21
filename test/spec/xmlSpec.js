'use strict';

describe('Filter: text2xml', function () {

  // load the controller's module
  beforeEach(module('xml2js'));

  var text2xml;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($filter) {
    text2xml = $filter('text2xml');
  }));

  it('should parse xml', function () {
    expect(text2xml('<root><node>Text</node></root>')).toBeTruthy();
  });

  describe('xml', function() {
    var xml;

    beforeEach(function() {
      xml = text2xml('<root><node>Text</node></root>');
    });

    it('should be a document', function () {
      expect(xml.nodeType).toBe(9);
    });

    it('should have one root', function () {
      expect(xml.childNodes.length).toBe(1);
    });

    it('should have correct root name', function () {
      expect(xml.childNodes[0].nodeName).toBe('root');
    });
  });
});

describe('Filter: xml2js', function () {
  beforeEach(module('xml2js'));

  var doc = '<?xml version="1.0"?><a:propfind xmlns:a="DAV:"><a:prop><a:getcontenttype/></a:prop><a:prop><a:getcontentlength>4711</a:getcontentlength></a:prop></a:propfind>',
      xml2js,
      xml;

  beforeEach(inject(function ($filter) {
    xml2js = $filter('xml2js');
    xml = $filter('text2xml')(doc);
  }));

  it('should convert to JSON', function() {
    expect(xml2js(xml)).toBeTruthy();
    expect(xml2js(xml).propfind).toBeTruthy();
  });

  describe('json propfind', function() {
    var propfind;

    beforeEach(function() {
      propfind = xml2js(xml).propfind;
    });

    it('should have proper namespace', function() {
      expect('@ns' in propfind).toBeTruthy();
      expect(propfind['@ns'].prefix).toBe('a');
      expect(propfind['@ns'].URI).toBe('DAV:');
    });

    it('should have proper attributes', function() {
      var attributes;
      expect('@attributes' in propfind).toBeTruthy();
      attributes = propfind['@attributes'];

      expect(attributes.a).toBeTruthy();
      expect(attributes.a['@ns']).toBeTruthy();
      expect(attributes.a['@ns'].prefix).toBe('xmlns');
      expect(attributes.a['@ns'].URI).toBe('http://www.w3.org/2000/xmlns/');
      expect(attributes.a.value).toBe('DAV:');
    });

    it('should have 2 prop children', function() {
      expect(propfind.prop.length).toBe(2);
    });

    it('should have correct getcontentlength value', function() {
      expect(propfind.prop[1].getcontentlength.value).toBe('4711');
    });
  });
});
