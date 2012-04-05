
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

  Object.keys(obj).forEach(function(k) {
    if (!props.hasOwnProperty(k)) {
      throw 'Invalid property found:' + k;
    }
  });
}

