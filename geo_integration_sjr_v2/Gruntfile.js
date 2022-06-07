module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['node_modules/bcrypt-nodejs/**/*',
                            'node_modules/body-parser/**/*',
                            'node_modules/crypto-js/**/*',
                            'node_modules/express/**/*',
                            'node_modules/jsonwebtoken/**/*',
                            'node_modules/knex/**/*',
                            'node_modules/moment/**/*',
                            'node_modules/morgan/**/*',
                            'node_modules/objection/**/*',
                            'node_modules/pg/**/*',
                            'node_modules/mssql/**/*',
                            'node_modules/wavy/**/*',
                            'node_modules/lodash/**/*',
                            'knexfile.js'
                        ],
                        dest: 'dist/<%= pkg.version %>/<%= pkg.name %>/',
                        filter: 'isFile'
                    }

                ],
            },
        },
        uglify: {
            files: {
                src: ['app/models/**/*.js'], // source files mask
                dest: 'dist/<%= pkg.version %>/<%= pkg.name %>/', // destination folder
                expand: true, // allow dynamic building
                flatten: false // remove all unnecessary nesting

            }
        },
        jshint: {
            files: ['Gruntfile.js', 'server.js', 'app/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },


        obfuscator: {
            files: ['app/util/**/*.js','app/services/**/*.js', 'server.js', 'config.js'],
            entry: 'server.js',
            out: 'dist/<%= pkg.version %>/<%= pkg.name %>/<%= pkg.name %>.js',
            strings: true,
            root: __dirname
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                    { src: ['dist/<%= pkg.version %>/<%= pkg.name %>/**'], dest: '/' } // includes files in path and its subdirs
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-obfuscator');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('obf', ['jshint', 'obfuscator']);
    grunt.registerTask('default', ['jshint', 'copy', 'uglify', 'obfuscator', 'compress']);

};
