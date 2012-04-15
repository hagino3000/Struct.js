#!/usr/bin/env node

var argv = require('optimist').argv,
    mu = require('mu2'),
    fs = require('fs'),
    targetPath;


if (argv.o) targetPath = argv.o;

if (argv.h || argv.help) {
  console.log('Usage: concat.js -o <output-file>\n or concat.js');
  process.exit(0);
}

var buffer = '';

mu.root = __dirname + '/../src/';
mu.compileAndRender('all.js', {})
  .on('data', function (data) {
    buffer += data.toString();
  })
  .on('end', function (data) {
    if (targetPath) {
      var out = fs.createWriteStream(targetPath, { 
          flags: 'w', 
          encoding: 'utf-8', 
          mode: 0644 
      });
      out.write(buffer);
      out.end();
    } else {
      process.stdout.write(buffer);
    }
  });


