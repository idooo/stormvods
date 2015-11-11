module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt)
    require('time-grunt')(grunt)

    var options = {
        config: {
            src: 'tools/grunt-tasks/*.js'
        },
        settings: {
            webSrc: 'web/src',
            webAssets: 'web/assets',
            webDist: 'web/dist',
            tmp: '.tmp'
        }
    }

    var configs = require('load-grunt-configs')(grunt, options);

    grunt.initConfig(configs);

    grunt.registerTask('dev', [
        'sass',
        'browserify',
        'watch'
    ]);

};
