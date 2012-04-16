/*
  struct.js ver0.3

  This module use Proxy API provided by ECMAScript 6 (Harmony)
  @see http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  With ES6-shim(https://github.com/paulmillr/es6-shim) it
  could also work in Firefox4 or Chrome.

  @author hagino3000(http://twitter.com/hagino3000)

 *
 */
(function(namespace) {
'use strict';

if (typeof namespace.Struct !== 'undefined') {
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
 * @this Struct
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
    // Check type
    var t = props[k].type;
    if (!typeChecker.hasOwnProperty(t) &&
        !REGEXP_STRUCT_TYPE.test(t)) {

      throw 'Supported types are :' +
            Object.keys(typeChecker).join() + ',struct:*';
    }

    // Set default writable:true
    if (props[k].writable === undefined) {
      props[k].writable = true;
    }

    // Create function from condition formula
    if (isString(props[k].cond)) {
      props[k].cond = new Function('v', 'return ' + props[k].cond);
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
};

/**
 * Returns specified name of struct is already defined.
 *
 * @param {String} name Struct name.
 * @this Struct
 * @return {boolean} If defined or not.
 */
Struct.ifdef = function(name) {
  return !!this.structs.hasOwnProperty(name);
};

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
};

/**
 * Check is struct object or not.
 *
 * @param {Object} obj Object.
 * @return {boolean} True if parameter is struct object.
 */
Struct.isStruct = function(obj) {
  return isObject(obj) && isString(obj[STRUCT_NAME_KEY]);
};

/**
 * Create struct object.
 *
 * @param {String} name Struct name.
 * @param {Object} obj Base object (option).
 * @this Struct
 * @return {Object} Struct object.
 */
Struct.create = function(name, obj) {
  if (!this.structs.hasOwnProperty(name)) {
    throw 'Struct named "' + name + '" is not defined';
  }
  var props = this.structs[name];

  obj = obj || {};
  checkInitialValue(obj, props);
  Object.defineProperties(obj, props);

  var ret;
  if (hasProxyAPI) {
    ret = Proxy.create(handlerMaker(obj, props));
  } else {
    //fallback
    ret = Object.seal(obj);
  }
  return ret;
};

/**
 * Configure behavior.
 *
 * @param {Object} config Configuration.
 * @this Struct
 */
Struct.configure = function(config) {
  if (Object.keys(this.structs).length > 0) {
    console.log('WARNING: Some structs are already defined.' +
                'This configure does not applied them.');
  }
  if (config['disable any check'] === true) {
    Struct.create = createFake;
  }
};

/**
 * For no-check mode.
 *
 * @param {String} name Struct name.
 * @param {Object} obj Base object (option).
 * @return {Object} Fake struct object.
 */
function createFake(name, obj) {
  obj = obj || {};

  // Only add property for type check.
  Object.defineProperty(obj, STRUCT_NAME_KEY, {
    value: name,
    wriatble: false,
    enumerable: false
  });
  return obj;
}

/**
 * Check struct type (internal)
 */
function isStructType(type, obj) {
  var mat = type.match(REGEXP_STRUCT_TYPE);
  if (mat && Struct.isStruct(obj)) {
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
 * Check initial object (internal)
 *
 * @param {Object} obj Check object.
 * @param {Object} props Property definitions.
 */
function checkInitialValue(obj, props) {

  Object.keys(props).forEach(function(k) {
    var p = props[k], val = obj[k];

    if (isNullOrUndefined(val)) {
      if (p.nullable === false) {
        throw k + ' is not-nullable property but initial value is null';
      }
      return;
    }

    if (isStructType(p.type, val) || isType(p.type, val)) {
      return;
    }

    var mat = p.type.match(REGEXP_STRUCT_TYPE);
    if (mat) {
      // Definition is struct type but normal object given
      var structName = mat[1];
      checkInitialValue(val, Struct.structs[structName]);
      // Auto boxing
      obj[k] = Struct.create(structName, val);
      return;
    }

    throw k + ' must be ' + props[k].type +
          ' type. But initial value not matched';
  });

  // Check each condition formula
  Object.keys(props).forEach(function(k) {
    var p = props[k], val = obj[k];
    if (p.cond && !p.cond(val)) {
      throw 'Invalid value:' + k + '=' + String(val);
    }
  });

  Object.keys(obj).forEach(function(k) {
    if (!props.hasOwnProperty(k)) {
      throw 'Invalid property found:' + k;
    }
  });
}



/**
 * Create trap functions (internal)
 *
 * @param {Object} obj Check object.
 * @param {Object} props Property definitions.
 * @return {Object} Proxy handler.
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
        if (desc && !desc.writable) {
          throw name + ' is not writable property';
        }

        if (props[name].nullable === false && isNullOrUndefined(val)) {
          throw name + ' is not allowd null or undefined';
        }

        // Check type match
        var type = props[name].type;
        if (isNullOrUndefined(val) || isStructType(type, val) || isType(type, val)) {
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
    'domnode': isDomNode
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

function isNullOrUndefined(val) {
  return val === null || val === undefined;
}



})(this);

