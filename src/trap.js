/**
 * Create trap functions (internal)
 */
function handlerMaker(obj, props) {
  return {

    getOwnPropertyDescriptor: function(name) {
      var desc = Object.getOwnPropertyDescriptor(obj, name);
      // a trapping proxy's properties must always be configurable
      if (desc !== undefined) { desc.configurable = true; }
      return desc;
    },

    getPropertyDescriptor: function(name) {
      var desc = Object.getPropertyDescriptor(obj, name); // not in ES5
      // a trapping proxy's properties must always be configurable
      if (desc !== undefined) { desc.configurable = true; }
      return desc;
    },

    getOwnPropertyNames: function() {
      return Object.getOwnPropertyNames(obj);
    },

    getPropertyNames: function() {
      return Object.getPropertyNames(obj);
    },

    defineProperty: function(name, desc) {
      throw 'Cannot fix this object';
    },

    /**
     * Delete specified property.
     * Check property name if defined in advance.
     */
    delete: function(name) {
      if (name in props) {
        return delete obj[name];
      } else {
        throw name + ' is not defined in this struct';
      }
    },

    fix: function() {
      if (Object.isFrozen(obj)) {
        return Object.getOwnPropertyNames(obj).map(function(name) {
          return Object.getOwnPropertyDescriptor(obj, name);
        });
      }
      // As long as obj is not frozen,
      // the proxy won't allow itself to be fixed
      return undefined; // will cause a TypeError to be thrown
    },

    has: function(name) {
      return name in obj;
    },

    hasOwn: function(name) {
      return Object.prototype.hasOwnProperty.call(obj, name);
    },

    /**
     * Get value of specified property.
     * Check property name if defined in advance.
     */
    get: function(receiver, name) {
      if (name in props) {
        return obj[name];
      } else {
        throw name + ' is not defined in this struct';
      }
    },

    /**
     * Set value.
     * Check property name if defined and type is matched in advance.
     */
    set: function(receiver, name, val) {
      if (name in props) {

        // Check property descriptor
        var desc = this.getOwnPropertyDescriptor(name);
        if (!desc || !desc.writable) {
          throw name + ' is not writable property';
        }

        // Check type match
        var type = props[name].type;
        if (val === null || val === undefined || 
            isStructType(type, val) || isType(type, val)) {
          // OK
        } else {
          throw name + ' must be ' + props[name].type + ' type';
        }

        obj[name] = val;
        return true;
      } else {
        throw name + ' is not defined in this struct';
      }
    },

    enumerate: function() {
      var result = [];
      for (var name in obj) { result.push(name); }
      return result;
    },

    keys: function() {
      return Object.keys(obj);
    }
  };
}
