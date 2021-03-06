(function(undefined) {
'use strict';

/**
 * Create trap functions (internal)
 *
 * @param {Object} obj Check object.
 * @param {Object} props Property definitions.
 * @return {Object} Proxy handler.
 */
Struct._handlerMaker = function(obj, props) {

  // Property name used by console.log
  var INSPECTOR_PROP_NAME = 'inspector';
  var checker = Struct.typeChecker;

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
    'delete': function(name) {
      if (name in props) {

        // Check property descriptor
        var desc = this.getOwnPropertyDescriptor(name);
        if (props[name].nullable === false) {
          throw name + ' is not allowd null or undefined';
        }

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
      if (name in props || name === INSPECTOR_PROP_NAME) {
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
        if (desc && !desc.writable) {
          throw name + ' is not writable property';
        }

        if (props[name].nullable === false && isNullOrUndefined(val)) {
          throw name + ' is not allowd null or undefined';
        }

        // Check type match
        var type = props[name].type;
        if (isNullOrUndefined(val) || Struct.isStructType(type, val) || Struct.util.isType(type, val)) {
          // OK
        } else {
          throw name + ' must be ' + props[name].type + ' type';
        }

        if (props[name].cond && !props[name].cond(val)) {
          throw 'Invalid value:' + name + '=' + String(val);
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
};

function isNullOrUndefined(val) {
  return val === null || val === undefined;
}

})();
