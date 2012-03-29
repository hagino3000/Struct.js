
var STRUCT_NAME_KEY = '__structName__';

var REGEXP_STRUCT_TYPE = /^struct:(.+)/;

// Check Proxy API is enabled
var hasProxyAPI = window.Proxy && (typeof(Proxy.create) === 'function');

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
