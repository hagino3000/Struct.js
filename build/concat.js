var mu = require('mu2'),
    fs = require('fs');

var buffer = '';

mu.root = __dirname + '/../';
mu.compileAndRender('template.js', {version: 0.1})
  .on('data', function (data) {
      buffer += data.toString();
  })
  .on('end', function (data){
      fs.writeFileSync('struct.js', buffer, 'UTF-8');
  });


