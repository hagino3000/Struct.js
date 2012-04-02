describe('Define struct', function() {

  it('Throws error when wrong parameter (name)', function() {
    expect(function() {
      Struct.define({});
    }).toThrow("First argument must be String type (Struct name)");
  });

  it('Throws error when wrong parameter (props)', function() {
    expect(function() {
      Struct.define('hoge', 'fuga');
    }).toThrow("Second argument must be Object type (Property settings)");
  });

  it('Can define an new struct', function() {

    Struct.define('Position', {
      x: {type: 'number'},
      y: {type: 'number'}
    });

    Struct.define('Ninja', {
      name: {type: 'string'},
      life: {type: 'number'},
      age:  {type: 'number', writable: false},
      pos:  {type: 'struct:Position'},
      updatedAt: {type: 'date', nullable: false}
    });

    expect(Struct.ifdef('Position')).toBe(true);
    expect(Struct.ifdef('Ninja')).toBe(true);
  });

  it('Cannot define struct already defined', function() {
    expect(function() {
      Struct.define('Ninja', {
        name: 'string',
        life: 'number'
      });
    }).toThrow('Ninja is already defined');
  });

  it('Should returns false Struct.ifdef for undefined name', function() {
    expect(Struct.ifdef('aaaaa')).toBe(false);
  });

});

describe('Create struct object', function() {

  var hanzo;

  beforeEach(function() {
    hanzo = Struct.create('Ninja', {
      name: 'Hanzo',
      life: 100,
      age: 20,
      updatedAt: new Date()
    });
  });

  it('Cannot create with name not defined', function() {
    expect(function() {
      var tmp = Struct.create('unknownStruct', {
        name: 'Hoge'
      });
    }).toThrow('Struct named "unknownStruct" is not defined');
  });

  it('Should be created specified struct with object', function() {

    var now = new Date();

    var sasuke = Struct.create('Ninja', {
      name: 'Sasuke',
      life: 100,
      age: 20,
      updatedAt: now,
      pos: Struct.create('Position', {
        x: 1, y:2
      })
    });

    expect(sasuke.name).toBe('Sasuke');
    expect(sasuke.life).toBe(100);
    expect(sasuke.updatedAt).toBe(now);
    expect(sasuke.pos.x).toBe(1);

  });

  it('Should be created specified struct with object (Auto boxing)', function() {

    var now = new Date();

    var sasuke = Struct.create('Ninja', {
      name: 'Sasuke',
      life: 100,
      age: 20,
      updatedAt: now,
      pos: {x: 1, y: 2}
    });

    expect(sasuke.name).toBe('Sasuke');
    expect(sasuke.life).toBe(100);
    expect(sasuke.updatedAt).toBe(now);
    expect(sasuke.pos.x).toBe(1);

  });

  it('Should be created specified struct without object', function() {

    var p = Struct.create('Position');
    expect(p.x).toBeUndefined();
    p.x = 10;
    expect(p.x).toBe(10);
    expect(p.y).toBeUndefined();
  });

  describe('Should be blocked to create struct with invalid object', function() {

    it('Throws error when violate nullable option', function() {
      expect(function() {
          // createdAt is not nullable
          var n = Struct.create('Ninja');
      }).toThrow('updatedAt is not-nullable property but initial value is null');
    });

    it('Throws error when violate type option', function() {
      expect(function() {
          // createdAt is not nullable
          var n = Struct.create('Ninja', {
            name: 'Sasuke',
            life: '10', // <= invalid
            age: 20,
            updatedAt: new Date()
          });
      }).toThrow('life must be number type. But initial value not matched');
    });
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

  it('Should be property changed by matched type', function() {
    hanzo.pos = Struct.create('Position', {
      x: 100,
      y: 999
    });
    expect(hanzo.pos.x).toBe(100);
    expect(hanzo.pos.y).toBe(999);
    hanzo.pos.x = 1000;
    hanzo.pos.y = 2000;
    expect(hanzo.pos.x).toBe(1000);
    expect(hanzo.pos.y).toBe(2000);
  });

  it('Should be blocked unmatched type write', function() {
    expect(function() {
      hanzo.life = "100";
    }).toThrow("life must be number type");
  });

  it('Should be blocked unmatched type write (Struct)', function() {
    expect(function() {
      hanzo.pos = {x: 100, y: 200};
    }).toThrow("pos must be struct:Position type");
  });

  it('Should be blocked update not-nullable field by null', function() {
    expect(function() {
      hanzo.updatedAt = null;
    }).toThrow("updatedAt is not allowd null or undefined");
  });

  it('Should be blocked update not-nullable field by undefined', function() {
    expect(function() {
      hanzo.updatedAt = undefined;
    }).toThrow("updatedAt is not allowd null or undefined");
  });

  it('Should be blocked delete not-nullable', function() {
    expect(function() {
        delete hanzo.updatedAt;
    }).toThrow("updatedAt is not allowd null or undefined");
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

  it('Should not get __structName__ property by (for .. in) statement', function() {
    for (var p in hanzo) {
      expect(p).not.toBe('__structName__');
    }

    // But struct object has __structName__ property
    expect(hanzo.hasOwnProperty('__structName__')).toBe(true);
  });

});

describe('Check struct type name', function() {

  it('Should get struct name', function() {
    Struct.define('ForTypeCheck', {
      hoge: {type: 'string'}
    });
    var c = Struct.create('ForTypeCheck');
    expect(Struct.getType(c)).toBe('ForTypeCheck');

    Struct.define('ForUnitTest', {
      hoge: {type: 'string'}
    });
    var c2 = Struct.create('ForUnitTest');
    expect(Struct.getType(c2)).toBe('ForUnitTest');
  });

  it('Should get undefined (normal object)', function() {
    expect(Struct.getType({})).toBeUndefined();
  });

  it('Should get undefined (Array)', function() {
    expect(Struct.getType([])).toBeUndefined();
  });

  it('Throws error when wrong parameter', function() {
    expect(function() {
      Struct.getType(true);
    }).toThrow('First argument must be object type');
  });
});

describe('Check is struct or not', function() {

  it('Should get true for struct object', function() {
    Struct.define('ForIsStructCheck', {
      hoge: {type: 'string'}
    });
    var c = Struct.create('ForIsStructCheck');
    expect(Struct.isStruct(c)).toBe(true);
  });

  it('Should get false (normal object)', function() {
    expect(Struct.isStruct({})).toBe(false);
  });

  it('Should get false (Array)', function() {
    expect(Struct.isStruct([])).toBe(false);
  });

  it('Should get false (null)', function() {
    expect(Struct.isStruct(null)).toBe(false);
  });

  it('Should get false (undefined)', function() {
    expect(Struct.isStruct(undefined)).toBe(false);
  });

});
