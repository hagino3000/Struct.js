describe('Create fake object by Struct.configure', function() {

  var fake;

  runs(function() {
    Struct.configure({
      "disable any check": true
    });

    Struct.define('ForFakeTest', {
      name: {type: 'string'},
      age:  {type: 'number', writable: false},
      updatedAt: {type: 'date', nullable: false}
    });
  });

  beforeEach(function() {
    fake = Struct.create('ForFakeTest', {
      name: 'Sasuke',
      life: 100,
      age: 20,
      updatedAt: new Date()
    });
  });

  describe('Fake object never throws errors', function() {

    it('Add new property', function() {
      fake.newProp = 'Added new property';
      expect(fake.newProp).toBe('Added new property');
    });

    it('Change not-writable property', function() {
      fake.age = 99;
      expect(fake.age).toBe(99);
    });

    it('Delete not-writable property', function() {
      delete fake.age;
      expect(fake.age).toBeUndefined();
    });

    it('Set null not-nullable property', function() {
      fake.updatedAt = null;
      expect(fake.updatedAt).toBe(null);
    });

    it('Set undefined not-nullable property', function() {
      fake.updatedAt = undefined;
      expect(fake.updatedAt).toBeUndefined();
    });

    it('Delete not-nullable property', function() {
      delete fake.updatedAt;
      expect(fake.updatedAt).toBeUndefined();
    });

  });

  describe('Fake object recognize as Struct object', function() {

    it('Should be recognized Struct object', function() {
      expect(Struct.isStruct(fake)).toBe(true);
    });

    it('Should be recognized Struct type', function() {
      expect(Struct.getType(fake)).toBe('ForFakeTest');
    });

  });

});
