var Struct = (typeof(require) != 'undefined') ? require('../Struct.js') : window.Struct;

var runNodejs = (typeof(require) != 'undefined');
var it_browser = (runNodejs ? xit : it);

describe('Native type checks', function() {

  var arrLike = {
    length: 0
  };

  var objLike = runNodejs ? new Map() : window.location;
  var domNode = runNodejs ? null : document.body;

  describe('String', function() {

    var structName = 'ForNativeTypeCheck_String';
    var type = 'string';
    Struct.define(structName, {
      p: {type: 'string'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be set string value', function() {
      obj.p = new String('test');
      obj.p = '';
      obj.p = 'String test';

      expect(obj.p).toBe('String test');
    });

    it('Sould be blocked unmatched type (number)', function() {
      expect(function() {
        obj.p = 100;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Number', function() {
    var structName = 'ForNativeTypeCheck_Number';
    var type = 'number';
    Struct.define(structName, {
      p: {type: 'number'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = '999';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set number value', function() {
      obj.p = new Number(999);
      obj.p = Infinity;
      obj.p = 300;

      expect(obj.p).toBe(300);
    });

    it('Sould be blocked unmatched type (boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Boolean', function() {
    var structName = 'ForNativeTypeCheck_Boolean';
    var type = 'boolean';
    Struct.define(structName, {
      p: {type: 'boolean'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = '999';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Number)', function() {
      expect(function() {
        obj.p = 999;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set boolean value', function() {
      obj.p = new Boolean(true);
      obj.p = false;

      expect(obj.p).toBe(false);
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Function', function() {
    var structName = 'ForNativeTypeCheck_Function';
    var type = 'function';
    Struct.define(structName, {
      p: {type: 'function'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = '999';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Number)', function() {
      expect(function() {
        obj.p = 999;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set function type', function() {
      var f = function(){};
      obj.p = new Function('return 1000');
      obj.p = f;

      expect(obj.p).toBe(f);
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Array', function() {
    var structName = 'ForNativeTypeCheck_Array';
    var type = 'array';
    Struct.define(structName, {
      p: {type: 'array'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = '999';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Number)', function() {
      expect(function() {
        obj.p = 999;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set array', function() {
      var arr = [1,2,3];
      obj.p = arr;
      expect(obj.p).toBe(arr);
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Array Like', function() {
    var structName = 'ForNativeTypeCheck_ArrayLike';
    var type = 'arraylike';
    Struct.define(structName, {
      p: {type: 'arraylike'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = '999';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Number)', function() {
      expect(function() {
        obj.p = 999;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set array', function() {
      var arr = [1,2,3];
      obj.p = arr;
      expect(obj.p).toBe(arr);
    });

    it('Sould be set Array Like', function() {
      obj.p = arrLike;
      expect(obj.p).toBe(arrLike);
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    xit('Sould be blocked unmatched type (Dom Node)', function() {
      // it depends dom node
      // Almost dom node is array like
    });

  });

  describe('Object', function() {
    var structName = 'ForNativeTypeCheck_Object';
    var type = 'object';
    Struct.define(structName, {
      p: {type: 'object'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = 'SSSSSS';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (number)', function() {
      expect(function() {
        obj.p = 100;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    xit('Sould be blocked unmatched type (Array Like)', function() {
      // it depends array like object
    });

    it('Sould be set object', function() {
      var o = {
        val: 'abc'
      };
      obj.p = o;
      expect(obj.p).toBe(o);
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Object Like', function() {

    var structName = 'ForNativeTypeCheck_ObjectLike';
    var type = 'anyobject';
    Struct.define(structName, {
      p: {type: 'anyobject'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = 'hoge';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (number)', function() {
      expect(function() {
        obj.p = 100;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set Array', function() {
      var arr = [];
      obj.p = arr;
      expect(obj.p).toBe(arr);
    });

    it('Sould be set array like', function() {
      obj.p = arrLike;
      expect(obj.p).toBe(arrLike);
    });

    it('Sould be set object', function() {
      var o = {};
      obj.p = o;
      expect(obj.p).toBe(o);
    });

    it('Sould be set object like', function() {
      obj.p = objLike;
      expect(obj.p).toBe(objLike);
    });

    it('Sould be set RegExp', function() {
      var r = /^regexp/g;
      obj.p = r;
      expect(obj.p).toBe(r);
    });

    it('Sould be set Date', function() {
      var d = new Date();
      obj.p = d;
      expect(obj.p).toBe(d);
    });

    it_browser('Sould be set dom node', function() {
      obj.p = domNode;
      expect(obj.p).toBe(domNode);
    });

  });

  describe('Date', function() {

    var structName = 'ForNativeTypeCheck_Date';
    var type = 'date';
    Struct.define(structName, {
      p: {type: 'date'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = 'date';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (number)', function() {
      expect(function() {
        obj.p = 100;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be set Date', function() {
      var d = new Date();
      obj.p = d;
      expect(obj.p).toBe(d);
    });

    it_browser('Sould be blocked unmatched type (Dom node)', function() {
      expect(function() {
        obj.p = document.body.firstChild;
      }).toThrow('p must be ' + type + ' type');
    });
  });

  describe('Dom Node', function() {

    var structName = 'ForNativeTypeCheck_DOM';
    var type = 'domnode';
    Struct.define(structName, {
      p: {type: 'domnode'}
    });
    var obj = Struct.create(structName, {});

    it('Sould be blocked unmatched type (String)', function() {
      expect(function() {
        obj.p = 'date';
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (number)', function() {
      expect(function() {
        obj.p = 100;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (boolean)', function() {
      expect(function() {
        obj.p = true;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (function)', function() {
      expect(function() {
        obj.p = function(){};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array)', function() {
      expect(function() {
        obj.p = [];
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Array Like)', function() {
      expect(function() {
        obj.p = arrLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object)', function() {
      expect(function() {
        obj.p = {};
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Object Like)', function() {
      expect(function() {
        obj.p = objLike;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (RegExp)', function() {
      expect(function() {
        obj.p = /^regexp/g;
      }).toThrow('p must be ' + type + ' type');
    });

    it('Sould be blocked unmatched type (Date)', function() {
      expect(function() {
        obj.p = new Date();
      }).toThrow('p must be ' + type + ' type');
    });

    it_browser('Sould be set dom node', function() {
      obj.p = domNode;
      expect(obj.p).toBe(domNode);
    });
  });

});
