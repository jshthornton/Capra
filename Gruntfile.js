module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			root: {
				options: {
					port: 8000
				}
			},
			coverage: {
				options: {
					port: 8001,
					base: 'coverage'
				}
			}
		},

		jshint: {
			// Rules are NOT merged.
			src: {
				options: {
					jshintrc: '.jshintrc'
				},
				files: {
					src: [
						'src/**/*.js'
					]
				}
			}
		},

		karma: {
			debug: {
				browsers: ['Chrome'],
				reporters: ['progress'],
				autoWatch: true,
				singleRun: false
			},
			ci: {
				configFile: 'karma.conf.js',
				reporters: ['progress', 'coverage'],
				singleRun: true,
				browsers: ['PhantomJS'],
				autoWatch: false
			},
			comprehensive: {
				configFile: 'karma.conf.js',
				reporters: ['progress', 'coverage'],
				browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE', 'IE9'],
				autoWatch: true,
				singleRun: false
			},
			modern: {
				configFile: 'karma.conf.js',
				reporters: ['progress', 'coverage'],
				browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'],
				autoWatch: true,
				singleRun: false
			},
			light: {
				configFile: 'karma.conf.js',
				reporters: ['progress', 'coverage'],
				browsers: ['PhantomJS'],
				autoWatch: true,
				singleRun: false
			}
		},

		watch: {
			src: {
				files: [
					'src/**/*.js'
				],
				tasks: [
					'jshint:src'
				]
			}
		},

		concurrent: {
			dev: {
				tasks: [
					'karma:light',
					'watch:src'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// Load Tasks
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');

	// Create Tasks
};