/*
  struct.js v0.1

  This module use Proxy API provided by ECMAScript 6 (Harmony)
  @see http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  With ES6-shim(https://github.com/paulmillr/es6-shim) it
  could also work in Firefox4 or Chrome.

  Example:

    Struct.define('ninja', {
      name: {type: 'string'},
      life: {type: 'number'},
      age:  {type: 'number', writable: false}
    });

    var sasuke = Struct.create('ninja', {
      name: 'Sasuke',
      life: 100,
      age: 20
    });

    sasuke.life = 50;       // works
    var name = sasuke.name; // works

    var bar = sasuke.undefProp; // Throws error
    sasuke.life = '50';         // Throws error
    sasuke.newProp = 'foo';     // Throws error

    delete sasuke.life;  // works
    delete sasuke.life_; // Throws error

    Struct.getType(sasuke); // => Returns 'ninja'

 *
 */
(function() {
  'use strict';

  if (typeof Struct !== 'undefined') {
    return;
  }

  var STRUCT_NAME_KEY = '__structName__';

  // Check Proxy API is enabled
  var hasProxyAPI = window.Proxy && (typeof(Proxy.create) === 'function');
  console.log('Proxy API?:', hasProxyAPI);

  /**
   * @class Struct
   */
  var Struct = window.Struct = {
    structs: {}
  };

  /**
   * Define new struct.
   *
   * @param {String} name Struct name.
   * @param {Object} props Property configs.
   */
  Struct.define = function(name, props) {
    if (typeof(name) !== 'string') {
      throw 'First argument must be String type (Struct name)';
    }
    if (typeof(props) !== 'object') {
      throw 'Second argument must be Object type (Property settings)';
    }
    if (this.structs[name]) {
      throw name + ' is already defined';
    }

    Object.keys(props).forEach(function(k) {
      // Set default writable:true
      if (props[k].writable === undefined) {
        props[k].writable = true;
      }
    });

    // Add type name property
    props[STRUCT_NAME_KEY] = {
      value: name,
      wriatble: false,
      enumerable: false
    };

    this.structs[name] = props;
  }

  /**
   * Gets struct type name.
   *
   * @param {Object} obj Object.
   * @return {String} Type name. Returns undefined
   * if an argument is not a Struct object.
   */
  Struct.getType = function(obj) {
    if (typeof obj !== 'object') {
      throw 'First argument must be object type';
    }
    if (obj.hasOwnProperty(STRUCT_NAME_KEY)) {
      return obj[STRUCT_NAME_KEY];
    }
    return undefined;
  }

  /**
   * Check is struct object or not.
   *
   * @param {Object} obj Object.
   * @return {boolean} True if parameter is struct object.
   */
  Struct.isStruct = function(obj) {
    return !!obj &&
           typeof obj === 'object' &&
           typeof obj[STRUCT_NAME_KEY] === 'string';
  }

  /**
   * Create struct object.
   *
   * @param {String} name Struct name.
   * @param {Object} obj Base object (option).
   * @return {Object} Struct object.
   */
  Struct.create = function(name, obj) {
    if (!this.structs.hasOwnProperty(name)) {
      throw 'Struct named "' + name + '" is not defined';
    }
    obj = obj || {};

    var props = this.structs[name];
    Object.defineProperties(obj, props);

    var ret;
    if (hasProxyAPI) {
      ret = Proxy.create(handlerMaker(obj, props));
    } else {
      //fallback
      ret = Object.seal(obj);
    }
    return ret;
  }

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

          // Check type
          var safe = false;
          if (val === null || val === undefined ||
              (typeof(val) === props[name].type)) {
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
})();

