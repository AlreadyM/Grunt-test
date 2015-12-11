module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	// LiveReload Start
		// LiveReload的默认端口号，你也可以改成你想要的端口号
		var lrPort = 35729;
		// 使用connect-livereload模块，生成一个与LiveReload脚本
		// <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
		var lrSnippet = require('connect-livereload')({port: lrPort});
		// 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
		var serveStatic = require('serve-static');
		var serveIndex = require('serve-index');
		var lrMiddleware = function(connect, options, middlwares) {
			return [
				lrSnippet,
				// 静态文件服务器的路径
				serveStatic(options.base[0]),
				// 启用目录浏览(相当于IIS中的目录浏览)
				serveIndex(options.base[0])
			];
		};
	// LiveReload End

	// minifile Start
		// *Src为源文件路径，*Save为保存路径
		var jshintSrc = ['Gruntfile.js','src/js/*.js'];

		var uglifySrc = ['src/js/*.js','src/*.js'],
		    uglifySave = 'build/js/<%=pkg.name%>-<%=pkg.version%>.min.js';

		var csslintSrc = 'src/css/*.css';

		var cssmin_minifySrc = 'src/css/',
		    cssmin_minifySave = 'build/css/',
		    cssmin_minifyincludeExcept = ['*.css',"!base.css"],
		    cssmin_combineSave = ['build/css/*.min.css'];

		var watch_file = ['Gruntfile.js','src/*.*'],// 被监测的文件(文件夹)
		    watch_tasks = ['jshint','uglify','csslint','cssmin']; // 监测到变动后执行的任务(tasks)
	// minifile End

	// 项目配置(任务配置)
		grunt.initConfig({
			// 读取我们的项目配置并存储到pkg属性中
			pkg: grunt.file.readJSON('package.json'),

			// LiveReload task Start
				// 通过connect任务，创建一个静态服务器
				connect: {
					options: {
						// 服务器端口号
						port: 8080,
						// 服务器地址(可以使用主机名localhost，也能使用IP)
						hostname: 'localhost',
						// 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
						base: '.'
					},
					livereload: {
						options: {
							// 通过LiveReload脚本，让页面重新加载。
							middleware: lrMiddleware
						}
					}
				},
			// livereload task End

			// copy file task Start
			copy:{
				cp_main:{
					files:[
						{
							expand:true,
							cwd:'src/',
							src:'**/*',
							dest:'dest/'
						}
					]
				},
				cp_html:{
					files:[
						{
							expand:true,
							cwd:'src/page',
							src:['*.html','*.htm'],
							dest:'dest/'
						}
					]
				},
				images:{
					files:[
						{
							expand:true,
							cwd:'src/images/',
							src:['*.jpg','*.png','*.gif'],
							dest:'dest/images'
						}
					]
				},
				cp_css:{
					files:[
						{
							expand:true,
							cwd:'src/css',
							src:['*.css'],
							dest:'.tmp/'
						}
					]
				}
			},
			// copy End

			//clean Start
			clean:{
				dist:{
					src:['dest/**/*']
				}
			},
			// minifile Start
			  	// 任务配置,所有插件的配置信息
			    // jshint配置信息(检查js语法的插件)
			    jshint:{
			    	options:{
			    		jshintrc:'.jshintrc'// jshint检测的语法规则在.jshintrc外部文件内配置规则
			    	},
			    	js:jshintSrc// jshint检测语法的对象文件(此处添加Gruntfile.js 是为了保证在编写grunt任务的js文件也同时被检查)
			    },
				    // uglify插件的配置信息(压缩js文件的插件)
				uglify: {
				    compressjs: {
				        src: uglifySrc,// 被压缩的对象
				        dest: uglifySave // 压缩后的文件存放位置和命名规则
				    }
				},
			    // csslint 配置信息(检查css语法的插件)
			    csslint:{
				    options:{
				        csslintrc:'.csslintrc' // csslint 检测的语法规则在.csslintrc外部文件内配置规则
				    },
				    css:csslintSrc // 此处添加被检测的对象文件（css文件）
				  },
			    // cssmin 配置信息(压缩css的插件)
			    cssmin: {
				    minify: {// 压缩css文件的配置信息
					    expand: true,// 开关属性(启用下面的选项)
					    cwd: cssmin_minifySrc,// 指定被压缩的文件路径
					    src: cssmin_minifyincludeExcept,// 匹配指定的目录下的所有css文件(也可排除.min.css文件[自由定义])
					    dest: cssmin_minifySave,// 生成的压缩文件存放路径
					    ext: '.min.css'// 生成的压缩文件命名规则(.min.css)
				    },
				    combineAll: {// 合并css文件的配置信息 
				        files: {
				        	'build/<%=pkg.name%>-<%=pkg.version%>.min.css': cssmin_combineSave// 输出合并后的文件路径 和被合并的指定文件
				        // (写入一个目录应该是该目录下所有文件被合并吧)
				      }
					}
				},
			// minifile End

			// watch 自动监测模块配置信息
				// 通过watch任务，来监听文件是否有更改
				watch: {
					client: {
						// 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
						options: {
							livereload: lrPort
						},
						// '**' 表示包含所有的子目录
						// '*' 表示包含所有的文件
						files: ['src/**/*.*']
					}//,
					//build:{
					//	files:watch_file,// 此处配置被监测文件(文件夹)
					//	tasks:watch_tasks,// 此处配置监测到变动后执行的任务（事件）
					//	options:{spawn:false}// (任务规则，额我也不知道是什么意思。空了再研究)
					//}
				},
			// watch End
			// 自定义build任务(压缩js、css，复制html、image)
				build:{
					options:{},
				    // jshint配置信息(检查js语法的插件)
				    jshint:{
				    	options:{
				    		jshintrc:'.jshintrc'// jshint检测的语法规则在.jshintrc外部文件内配置规则
				    	},
				    	js:jshintSrc// jshint检测语法的对象文件(此处添加Gruntfile.js 是为了保证在编写grunt任务的js文件也同时被检查)
				    },
					    // uglify插件的配置信息(压缩js文件的插件)
					uglify: {
					    compressjs: {
					        src: uglifySrc,// 被压缩的对象
					        dest: uglifySave // 压缩后的文件存放位置和命名规则
					    }
					}
				}
			// build End
		});
	// grunt.initConfig配置完毕

	// 加载插件
		// grunt.loadNpmTasks('grunt-contrib-copy');
		// grunt.loadNpmTasks('grunt-contrib-clean');
		// grunt.loadNpmTasks('grunt-contrib-jshint');
		// grunt.loadNpmTasks('grunt-contrib-uglify');
		// grunt.loadNpmTasks('grunt-contrib-csslint');
		// grunt.loadNpmTasks('grunt-contrib-cssmin');
		// grunt.loadNpmTasks('grunt-contrib-connect');
		// grunt.loadNpmTasks('grunt-contrib-watch');

	// 自定义任务
		grunt.registerTask('default', ['connect', 'watch']);
		grunt.registerTask('preview',['jshint','autoprefixer']);
		grunt.registerTask('hintmini', ['jshint','uglify','csslint','cssmin']);
		grunt.registerTask('build', ['build']);
};