'use strict';

describe('Filter: textToXml', function () {

  // load the controller's module
  beforeEach(module('xemle.xml'));

  var textToXml;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($filter) {
    textToXml = $filter('textToXml');
  }));

  it('should parse xml', function () {
    expect(textToXml('<root><node>Text</node></root>')).toBeTruthy();
  });

  describe('xml', function() {
    var xml;

    beforeEach(function() {
      xml = textToXml('<root><node>Text</node></root>');
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

describe('Filter: xmlToJson', function () {
  beforeEach(module('xemle.xml'));

  var doc = '<?xml version="1.0"?><a:propfind xmlns:a="DAV:"><a:prop><a:getcontenttype/></a:prop><a:prop><a:getcontentlength>4711</a:getcontentlength></a:prop></a:propfind>',
      xmlToJson,
      xml;

  beforeEach(inject(function ($filter) {
    xmlToJson = $filter('xmlToJson');
    xml = $filter('textToXml')(doc);
  }));

  it('should convert to JSON', function() {
    expect(xmlToJson(xml)).toBeTruthy();
    expect(xmlToJson(xml).propfind).toBeTruthy();
  });

  describe('json propfind', function() {
    var propfind;

    beforeEach(function() {
      propfind = xmlToJson(xml).propfind;
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
