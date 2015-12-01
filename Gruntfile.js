// 包装函数
module.exports = function(grunt) {

  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // uglify插件的配置信息
    uglify: {
      js: {
        src: 'src/*.js',
        dest: 'build/<%=pkg.name%>-<%=pkg.version%>.min.js'
      }
    },
    jshint:{
      options:{
        jshintrc:'.jshintrc'
      },
      js:['Gruntfile.js','src/*.js']
    },
    csslint:{
      options:{
        csslintrc:'.csslintrc'
      },
      css:['src/*.css']
    },
    watch:{
      build:{
        files:['Gruntfile.js','src/*.js'],
        tasks:['jshint','uglify'],
        options:{spawn:false}
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
  grunt.registerTask('default', ['jshint','csslint','uglify']);
};