/*
  struct.js ver0.1

  This module use Proxy API provided by ECMAScript 6 (Harmony)
  @see http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  With ES6-shim(https://github.com/paulmillr/es6-shim) it
  could also work in Firefox4 or Chrome.

 *
 */
(function(namespace) {
'use strict';

if (typeof Struct !== 'undefined') {
  return;
}


var STRUCT_NAME_KEY = '__structName__';

var REGEXP_STRUCT_TYPE = /^struct:(.+)/;

// Check Proxy API is enabled
var hasProxyAPI = window.Proxy && isFunction(Proxy.create);

// Support types and check methods
var typeChecker = createChecker();

/**
 * @class Struct
 */
var Struct = namespace.Struct = {
  structs: {}
};

/**
 * Define new struct.
 *
 * @param {String} name Struct name.
 * @param {Object} props Property configs.
 */
Struct.define = function(name, props) {
  if (!isString(name)) {
    throw 'First argument must be String type (Struct name)';
  }
  if (!isObject(props)) {
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

  // Struct definition will never change
  Object.freeze(props);

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
  if (!isObjectLike(obj)) {
    throw 'First argument must be object type';
  }
  if (isObject(obj) && obj.hasOwnProperty(STRUCT_NAME_KEY)) {
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
  return isObject(obj) && isString(obj[STRUCT_NAME_KEY]);
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
 * Check struct type (internal)
 */
function isStructType(type, obj) {
  var mat = type.match(REGEXP_STRUCT_TYPE);
  if (mat && Struct.isStruct(obj)) {
    console.log(mat[1]);
    console.log(Struct.getType(obj));
    return Struct.getType(obj) === mat[1];
  }
  return false;
}

/**
 * Check value type (internal)
 */
function isType(type, val) {
  if (typeChecker[type]) {
    return typeChecker[type](val);
  }
  return false;
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


/**
 * Create type checker (internal)
 */
function createChecker() {
  return {
    'string': isString,
    'number': isNumber,
    'boolean': isBoolean,
    'function': isFunction,
    'array': isArray,
    'arraylike': isArrayLike,
    'object': isObject,
    'anyobject': isObjectLike,
    'regexp': isRegExp,
    'date': isDate,
    'domnode': isDomNode,
  };
}

///////////////////////////////////////////////
// Type check functions
///////////////////////////////////////////////
function toString(val) {
  return Object.prototype.toString.call(val);
}

function isString(val) {
  return toString(val) === '[object String]';
}

function isNumber(val) {
  return toString(val) === '[object Number]' && !isNaN(val);
}

function isBoolean(val) {
  return toString(val) === '[object Boolean]';
}

function isFunction(val) {
  return toString(val) === '[object Function]';
}

function isArray(val) {
  return toString(val) === '[object Array]';
}

function isArrayLike(val) {
  return isArray(val) ||
         (val && typeof(val) === 'object' && isNumber(val.length));
}

function isObject(val) {
  return toString(val) === '[object Object]';
}

function isObjectLike(val) {
  return val !== null && typeof(val) === 'object';
}

function isRegExp(val) {
  return toString(val) === '[object RegExp]';
}

function isDate(val) {
  return toString(val) === '[object Date]';
}

function isDomNode(val) {
  return val && isString(val.nodeName) && isArrayLike(val.childNodes);
}



})(this);

