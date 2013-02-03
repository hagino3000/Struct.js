/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      name: 'Struct.js'
    },
    exec: {
      run_nodejs_test: {
        command: 'npm test',
        stdout: true
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    concat: {
      dist: {
        src: [
          '<file_template:src/header.txt>',
          '<file_strip_banner:src/prepare.js>',
          '<file_strip_banner:src/typecheck.js>',
          '<file_strip_banner:src/handlermaker.js>',
          '<file_strip_banner:src/api.js>'
        ],
        dest: 'struct.js'
      }
    },
    min: {
      dist: {
        src: [
        '<config:concat.dist.dest>'
        ],
        dest: 'struct.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
      'global': true, 
      'module': true, 
      'console': true, 
      'Proxy': true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('test', 'exec');
  grunt.registerTask('default', 'lint concat test min');

  grunt.loadNpmTasks('grunt-exec');

};
