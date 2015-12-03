/* 此配置目的是为了对编写的js文件，css文件进行语法校验；
和对校验通过的js或css文件进行压缩以便发布到服务器的时候文件是最小体积的js或者css
that`s all
*/
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
      minify: {// 压缩css文件的配置信息
        expand: true,// 开关属性(启用下面的选项)
        cwd: 'src/',// 指定被压缩的文件路径
        src: ['*.css', '!base.css'],// 匹配指定的目录下的所有css文件(排除.min.css文件)
        dest: 'build/',// 生成的压缩文件存放路径
        ext: '.min.css'// 生成的压缩文件命名规则(.min.css)
      },
      combine: {// 合并css文件的配置信息
        files: {
          'build/<%=pkg.name%>-<%=pkg.version%>.min.css': ['build/base-1.min.css', 'build/am-slider.min.css']// 输出合并后的文件路径 和被合并的指定文件
          // (写入一个目录应该是该目录下所有文件被合并吧)
        }
      }
    },
    // watch 自动监测模块配置信息
    watch:{
      build:{
        files:['Gruntfile.js','src/*.js',"src/*.css"],// 此处配置被监测文件
        tasks:['jshint','uglify','csslint','cssmin'],// 此处配置监测到变动后执行的任务（事件）
        options:{spawn:false}// (任务规则，额我也不知道是什么意思。空了再研究)
      }
    }
  });

  //加载插件模块
  // 告诉grunt我们需要用到的插件
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // 告诉grunt当我们在终端中输入grunt时需要做些什么
  grunt.registerTask('default', ['jshint','uglify','csslint','cssmin','watch']);
};