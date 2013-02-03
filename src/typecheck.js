;(function(undefined) {
'use strict';

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

Struct.typeChecker = {
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

/**
 * Check value type (internal)
 */
function isType(type, val) {
  if (Struct.typeChecker[type]) {
    return Struct.typeChecker[type](val);
  }
  return false;
}


Struct.util = {
  isString: isString,
  isObject: isObject,
  isObjectLike: isObjectLike,
  isType: isType,
  isNullOrUndefined: isNullOrUndefined
}

})();

