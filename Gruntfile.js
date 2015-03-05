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
			app: {
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
	});

	// Load Tasks
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Create Tasks
};