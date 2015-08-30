var pkg = require('./package.json');

module.exports = function (grunt) {
  grunt.initConfig({
        browserify: {
            example: {
                src: './examples/SpatialDataEx.js',
                dest: './SpatialDataEx.js',
                options: {
                    debug: true,
                    extensions: ['.js'],
                    transform: ["babelify"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.registerTask('build', ['browserify:example']);
};