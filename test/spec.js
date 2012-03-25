if (!window.Proxy) {
  alert('Proxy API is disabled in this browser');
}

describe('Global object definition', function() {

  it('Defined global object named "Struct"', function() {
    expect(window.Struct).toBeDefined();
  });

  it('Defined function Struct.reg', function() {
    expect(typeof Struct.reg).toBe('function');
  });

  it('Defined function Struct.create', function() {
    expect(typeof Struct.create).toBe('function');
  });

});

describe('Register struct', function() {


  it('Can register an new struct', function() {

    Struct.reg('ninja', {
      name: {
        type: 'string'
      },
      life: {
        type: 'number'
      },
      age: {
        type: 'number', writable: false
      }
    });

    expect(Struct.structs['ninja']).toBeDefined();
  });

  it('Cannot register struct already registered', function() {
    expect(function() {
      Struct.reg('ninja', {
        name: 'string',
        life: 'number'
      });
    }).toThrow('ninja is already registered');
  });

});

describe('Create struct object', function() {

  var hanzo;

  beforeEach(function() {
    if (hanzo) {
      hanzo.life = 100;
      hanzo.name = 'Sasuke';
    }
  });

  it('Cannot create with name not registered', function() {
    expect(function() {
      var tmp = Struct.create('unknownStruct', {
        name: 'Hoge'
      });
    }).toThrow('Struct named "unknownStruct" is not registered');
  });

  it('Should be created specified struct with object', function() {

    hanzo = Struct.create('ninja', {
      name: 'Hanzo',
      life: 200,
      age: 20
    });

    expect(hanzo.name).toBe('Hanzo');
    expect(hanzo.life).toBe(200);

  });

  it('Should be created specified struct without object', function() {

    var n = Struct.create('ninja');
    n.name = 'Sasuke';
    n.life = 10;

    expect(n.name).toBe('Sasuke');
    expect(n.life).toBe(10);
    expect(n.age).toBeUndefined();
  });


  describe('Should be sealed undefiend property access', function() {

    it('Throws error when read undefined property', function() {
      expect(function() {
        var foo = hanzo.bar;
      }).toThrow('bar is not defined in this struct');
    });

    it('Throws error when write undefined property', function() {
      expect(function() {
        hanzo.hoge = null;
      }).toThrow('hoge is not defined in this struct');
    });

    it('Throws error when delete undefined property', function() {
      expect(function() {
        delete hanzo.notDefinedProperty;
      }).toThrow('notDefinedProperty is not defined in this struct');
    });
  });

  it('Should be blocked unmatched type write', function() {
    expect(function() {
      hanzo.life = "100";
    }).toThrow("life must be number type");
  });

  it('Can set null value', function() {
    hanzo.life = null;
    expect(hanzo.life).toBeNull();
  });

  it('Can set undefined value', function() {
    hanzo.life = undefined;
    expect(hanzo.life).toBeUndefined();
  });

  it('Can set same type value', function() {
    hanzo.life = Number(9999);
    expect(hanzo.life).toBe(9999);
  });

  it('Cannot update readonly property', function() {
    expect(function() {
      hanzo.age = 21;
    }).toThrow("age is not writable property");
  });

});
