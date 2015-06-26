module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ejs-static');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-rigger');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-svg-sprite');

	require('time-grunt')(grunt);

	grunt.initConfig({

		clean : {
			all : ['.tmp/**/*', 'build/**/*']
		},

		/*
		 SCSS
		 */
		sass: {
			build: {
				options: {
					outputStyle: 'compressed'
				},
				files: {
					"build/css/main.min.css": ["dev/scss/main.scss"]
				}
			},
			fast: {
				options: {
					outputStyle: 'expanded'
				},
				files: {
					"build/css/main.min.css": ["dev/scss/main.scss"]
				}
			}
		},

		/*
		Javascripts
		 */
		rig: {
			js: {
				options: {
					banner: '/* Better than, date: <%= new Date() %> */\n'
				},
				files: {
					'.tmp/js/main.min.js': ['dev/js/main.js']
				}
			}
		},

		uglify: {
			build : {
				options : {
					mangle: false,
					compress: true
				},
				files : {
					'build/js/main.min.js': ['.tmp/js/main.min.js']
				}
			}
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			uses_defaults: ['dev/js/app/**/*.js']
		},

		/*
		Copy
		 */
		copy: {
			vendor:{
				expand: true,
				cwd: 'dev/js/vendor/',
				src: ['**/*.js'],
				dest: 'build/js/vendor/'
			},
			js:{
				src: '.tmp/js/main.min.js',
				dest: 'build/js/main.min.js'
			},
			images:{
				expand: true,
				cwd: 'dev/images/vendor/',
				src: ['**/*'],
				dest: 'build/images/'
			}
		},

		/*
		SVG sprites
		*/
		svg_sprite : {
			options : {
				mode : {
					symbol : true,
					bust: false,
					sprite: "sprite.svg"
				}
			},
			sprite : {
				src : ['dev/images/sprites/**/*.svg'],
				dest: 'dev/images/'
			}
		},

		/*
		Image minification
		 */
		imagemin : {
			build:{
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{ removeViewBox: false }]
				},
				files: [{
					expand: true,
					cwd: 'dev/images/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'build/images/'
				}]
			}
		},

		/*
		EJS templates
		 */
		ejs_static: {
			templates: {
				options: {
					dest: 'build',
					path_to_data: 'dev/data/data.json',
					path_to_layouts: 'dev/',
					index_page: 'index',
					parent_dirs: false,
					underscores_to_dashes: true,
					file_extension: '.html'
				}
			}
		}
	});



	/*
	Tasks
	 */

	grunt.registerTask('fast', ['sass:fast', 'jshint', 'rig:js', 'newer:copy:js', 'newer:copy:vendor', 'newer:svg_sprite','newer:copy:images', 'ejs_static']);
	grunt.registerTask('build', ['sass:build', 'jshint', 'rig:js', 'uglify:build', 'copy:vendor', 'svg_sprite','newer:imagemin', 'ejs_static']);
	grunt.registerTask('clear', ['clean']);


};