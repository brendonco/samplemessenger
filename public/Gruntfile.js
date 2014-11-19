module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    DIST_DIR: './dist',
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    sass: {
      compile: {
        files: {
          './dist/css/main.css' : ['scss/main.scss']
        }
      }
    },
    copy:{
      main:{
        files:[
          {expand:true, flatten:true, src:['./*.html'], dest:"<%=DIST_DIR%>", filter:'isFile'},
          {expand:true, flatten:false, src:['html/**/*.html'], dest:"<%=DIST_DIR%>", filter:'isFile'},
          {expand:true, flatten:true, src:['lib/*'], dest:"<%=DIST_DIR%>/lib"},
          {expand:true, flatten:true, src:['img/*.gif', 'app/img/*.png'], dest:"./dist/www/img"}
        ]
      }
    },
    concat: {
      js: {
        src: 'js/**/*.js',
        dest: '<%=DIST_DIR%>/js/app.js'
      }
    },
    clean:{
      options: { force:true },
      release:["<%=DIST_DIR%>"]
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'sass', 'concat']);

};