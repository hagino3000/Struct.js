
if (!window.Proxy) {
  alert('Proxy API is disabled in this browser');
}

describe('Global object definition', function() {

  it('Defined global object named "Struct"', function() {
    expect(window.Struct).toBeDefined();
  });

  it('Defined function Struct.define', function() {
    expect(typeof Struct.define).toBe('function');
  });

  it('Defined function Struct.create', function() {
    expect(typeof Struct.create).toBe('function');
  });

  it('Defined function Struct.ifdef', function() {
    expect(typeof Struct.ifdef).toBe('function');
  });

  it('Defined function Struct.getType', function() {
    expect(typeof Struct.getType).toBe('function');
  });

  it('Defined function Struct.isStruct', function() {
    expect(typeof Struct.isStruct).toBe('function');
  });

  it('Defined function Struct.isStructType', function() {
    expect(typeof Struct.isStruct).toBe('function');
  });

});

