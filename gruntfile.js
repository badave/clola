var hbs = require("hbs");

module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        // asi: true, // semicolons
        smarttabs: true,
        curly: true,
        // eqnull: true,
        sub: true, // dot notation
        eqeqeq: true,
        undef: true,
        unused: true,
        globals: {
          '$': true,
          '_': true,
          'Handlebars': true,
          'Modernizr': true,
          'mixpanel': true,
          'accounting': true,
          '_gaq': true,
          'ga_id': true,
          'cart': true,
          'creeper': true,
          'json': true,
          'api_url': true,
          jQuery: true,
          console: true,
          module: true,
          exports: true,
          document: true,
          window: true,
          navigator: true,
          setTimeout: true
        }
      },
      public_js: {
        files: [{
          expand: true,
          src: ['*.js', '!backbone.js', '!highcharts.js', '!prettify.js', '!jquery-ui-sortable.js'],
          cwd: "public/js"
        }]
      },
      test: {
        files: [{
          expand: true,
          src: ['o.js', 'celery.js', 'overlay.js', 'embed.js', 'creeper.js', 'shop.js'],
          cwd: "public/js"
        }]
      }
    },

    // Concat
    concat: {
      // Concat all js: jquery first, then /lib/*, then /src/*
      js: {
        src: ['public/js/lib/jquery-1.9.1.min.js', 'public/js/lib/underscore.min.js', 'public/js/lib/handlebars.js', 'public/js/lib/bootstrap.js', 'public/js/lib/**/*.js', 'public/js/src/**/*.js'],
        dest: 'build/concat/js/application.bundle.js'
      },
      // Concat all css: bootstrap first, then /lib/*, then /src/*
      css: {
        src: ['public/css/lib/**/*.css', 'public/css/src/**/*.css'],
        dest: 'build/concat/css/application.bundle.css'
      }
    },

    // Minify JS
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'Backbone', 'Highcharts']
        }
      },
      js: {
        src: 'build/concat/js/application.bundle.js',
        dest: 'build/min/application.js'
      },
      public_js: {
        files: [{
          expand: true,
          src: ["*.js", '!html5shiv.js', '!unused/*.js'],
          dest: "build/min",
          cwd: "public/js",
          ext: '.js'
        }]
      }
    },

    // Compile Less
    less: {
      options: {
        yuicompress: true
      },
      public_css: {
        files: [{
          expand: true,
          src: "*.less", 
          dest: "build/min",
          cwd: "less",
          ext: '.css'
        }]
      }
    },

    // Minify CSS
    cssmin: {
      options: {
        // report: true
      },
      css: {
        src: 'build/concat/css/application.bundle.css',
        dest: 'build/min/application.css'
      }
    },

    // MD5 files and copy to public assets directory
    md5: {
      all: {
        files: [{
          expand: true,
          src: "*",
          dest: "assets/",
          cwd: "build/min"
        }],
        options: {
          after: function(fileChanges, options) {
            if(fileChanges) {
              var hsh = {}
              fileChanges.forEach(function(change) {
                var split = change.oldPath.split("/");
                var spl = change.newPath.split("/");
                var oldName = split[split.length-1];
                var newName = spl[spl.length-1];
                hsh[oldName] = newName;
              })
              var json = JSON.stringify(hsh);
              // grunt.log(json);

              grunt.file.write("manifest.json", json, function(err) {
                if(err) {
                  grunt.log.writeln(err);
                } else {
                  grunt.log.writeln("Created manifest.json");
                }
              })

            } else {
              grunt.log.writeln("No file changes");
            }
          }
        }
      }
    }
  });

  // Load grunt modules
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-md5');

  // Tasks
  grunt.registerTask("lint", ["jshint:public_js"]);
  grunt.registerTask("all", ['concat:js', 'concat:css', 'uglify:js', 'uglify:public_js', 'less:public_css', 'cssmin:css', "md5:all"])
  grunt.registerTask("default", "all");
};