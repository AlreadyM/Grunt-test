// 包装函数
module.exports = function(grunt) {

  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // jshint配置信息
    jshint:{
      options:{
        jshintrc:'.jshintrc'// jshint检测的语法规则在.jshintrc外部文件内配置规则
      },
      js:['Gruntfile.js','src/*.js']// jshint检测语法的对象文件(此处添加Gruntfile.js 是为了保证在编写grunt任务的js文件也同时被检查)
    },
     // uglify插件的配置信息(压缩js文件的插件)
    uglify: {
      js: {
        src: 'src/*.js',// 被压缩的对象
        dest: 'build/<%=pkg.name%>-<%=pkg.version%>.min.js'// 压缩后的文件存放位置和命名规则
      }
    },
    // csslint 配置信息
    csslint:{
      options:{
        csslintrc:'.csslintrc'// csslint 检测的语法规则在.csslintrc外部文件内配置规则
      },
      css:['src/*.css']// 此处添加被检测的对象文件（css文件）
    },
    // cssmin 配置信息(压缩css)
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      },
      combine: {
        files: {
          'css/out.min.css': ['css/part1.min.css', 'css/part2.min.css']
        }
      }
    },
    // watch 自动监测模块配置信息
    watch:{
      build:{
        files:['Gruntfile.js','src/*.js',"src/*.css"],// 此处配置被监测文件
        tasks:['jshint','csslint','uglify'],// 此处配置监测到变动后执行的任务（事件）
        options:{spawn:false}// (任务规则，额我也不知道是什么意思。空了再研究)
      }
    }
  });

  //加载插件模块
  // 告诉grunt我们需要用到的插件
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // 告诉grunt当我们在终端中输入grunt时需要做些什么
  grunt.registerTask('default', ['jshint','csslint','uglify','watch']);
};