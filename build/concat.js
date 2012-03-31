var mu = require('mu2'),
    fs = require('fs');

var OUTPUT_FILE_NAME = 'struct.js';
var buffer = '';

mu.root = __dirname + '/../src/';
mu.compileAndRender('all.js', {version: 0.1})
  .on('data', function (data) {
      buffer += data.toString();
  })
  .on('end', function (data){
      fs.writeFileSync(OUTPUT_FILE_NAME, buffer, 'UTF-8');
      console.log('Created:' + OUTPUT_FILE_NAME);
  });


