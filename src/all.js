/*
  struct.js ver{{version}}

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

{{>api.js}}

{{>trap.js}}

{{>typechecker.js}}

})(this);

