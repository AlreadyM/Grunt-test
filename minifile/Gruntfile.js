/* 此配置目的是为了对编写的js文件，css文件进行语法校验；
和对校验通过的js或css文件进行压缩以便发布到服务器的时候文件是最小体积的js或者css
that`s all
*/
// 包装函数
module.exports = function(grunt) {
    // *Src为源文件路径，*Save为保存路径
  var jshintSrc = ['Gruntfile.js','src/js/*.js'];

  var uglifySrc = ['src/js/*.js','src/*.js'],
        uglifySave = 'build/js/<%=pkg.name%>-<%=pkg.version%>.min.js';

  var csslintSrc = 'src/css/*.css';

  var cssmin_minifySrc = 'src/css/',
        cssmin_minifySave = 'build/css/',
        cssmin_minifyincludeExcept = ['*.css',"!base.css"],
        cssmin_combineSave = ['build/css/*.min.css'];

  var watch_file = ['Gruntfile.js','src/*/*.js',"src/*/*.css"],// 被监测的文件(文件夹)
        watch_tasks = ['jshint','uglify','csslint','cssmin'];// 监测到变动后执行的任务(tasks)

  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    // watch 自动监测模块配置信息
    watch:{
      build:{
        files:watch_file,// 此处配置被监测文件(文件夹)
        tasks:watch_tasks,// 此处配置监测到变动后执行的任务（事件）
        options:{spawn:false}// (任务规则，额我也不知道是什么意思。空了再研究)
    }
}
});

  // 加载插件模块
  // 告诉grunt我们需要用到的插件
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify'); 
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // 告诉grunt当我们在终端中输入grunt时需要做些什么
  grunt.registerTask('default', ['jshint','uglify','csslint','cssmin','watch']);
};