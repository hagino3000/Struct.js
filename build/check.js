#!/usr/bin/env node

var argv = require('optimist').argv,
    jshint = require("./jshint").JSHINT,
    src;

if (argv.h || argv.help) {
  console.log('Usage: check.js <input-file>\n or check.js < <input file>');
  process.exit(0);
}

if (argv._[0]) {
  var path = argv._[0];
  src = require("fs").readFileSync(path, 'utf8');
  check(src);
} else {
  var stdin = process.openStdin();
  stdin.setEncoding('utf-8');
  stdin.on('data', function(chunk) { src += chunk; });
  stdin.on('end', function() { check(src); });
}

function check(text) {

  var	config = {
    evil: true,
    browser: true,
    wsh: true,
    eqnull: true,
    expr: true,
    curly: true,
    trailing: true,
    undef: true,
    smarttabs: true,
    predef: [
      "Proxy",
      "console"
    ],
    maxerr: 100
  };

  if (jshint(text, config)) {
    console.log('JSHint check passed');
  } else {
    console.log('JSHint found errors.');

    jshint.errors.forEach(function(e) {
      if (!e) {return;}

      var str = e.evidence ? e.evidence : "",
      character = e.character === true ? "EOL" : "C" + e.character;

      if (str) {
        str = str.replace( /\t/g, " " ).trim();
        console.log( " [L" + e.line + ":" + character + "] " + e.reason + "\n  " + str + "\n");
      }
    });
  }
}

