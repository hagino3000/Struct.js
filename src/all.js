/*
  struct.js ver0.4

  This module use Proxy API provided by ECMAScript 6 (Harmony)
  @see http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  On browser:
    With ES6-shim(https://github.com/paulmillr/es6-shim) it
    could also work in Firefox4 or Chrome.

  On node.js
    You have to add node option --harmony_proxies or --harmony option.

  @author hagino3000(http://twitter.com/hagino3000)

 */
;(function(global, undefined) {
'use strict';

if (typeof(global.Struct) !== 'undefined') {
  return;
}

{{>api.js}}

{{>trap.js}}

{{>typechecker.js}}


if (typeof(module) != 'undefined' && module.exports) {
  module.exports = Struct;
} else {
  window.Struct = Struct;
}


})(typeof(window) != 'undefined' ? window : global);

