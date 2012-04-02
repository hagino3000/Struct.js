/*
  struct.js ver0.1

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

{{>api.js}}

{{>trap.js}}

{{>typechecker.js}}

})(this);

