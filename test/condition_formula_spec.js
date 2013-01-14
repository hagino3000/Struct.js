var Struct = (typeof(require) != 'undefined') ? require('../Struct.js') : window.Struct;

describe('Condition formula', function() {

  Struct.define('TestForFormula', {
    x: {
      type: 'number', 
      cond: 'v > 100'
    },
    y: {
      type: 'number',
      cond: function(v){return v != 100}
    },
    z: {
      type: 'string',
      cond: null
    }
  });

  it('Should be error by condition formula string', function() {
    expect(function() {
      Struct.create('TestForFormula', {
        x: 100,
        y: 200
      });
    }).toThrow('Invalid value:x=100');
  });

  it('Should be error by condition formula function', function() {
    expect(function() {
      Struct.create('TestForFormula', {
        x: 101,
        y: 100
      });
    }).toThrow('Invalid value:y=100');
  });

  it('Should be no-error with valid values', function() {
    var s = Struct.create('TestForFormula', {
      x: 101,
      y: 999,
      z: 'abc'
    });
    expect(s.x).toBe(101);
    expect(s.y).toBe(999);
    expect(s.z).toBe('abc');
  });

  it('Should be error when invalid value assigning', function() {
    var s = Struct.create('TestForFormula', {
      x: 101,
      y: 999,
      z: 'abc'
    });
    expect(function() {
      s.x = 100;
    }).toThrow('Invalid value:x=100');
  });

});

