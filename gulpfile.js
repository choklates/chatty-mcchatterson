var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();

var bs              = require('browser-sync');
var runSequence     = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('public/css/**/*.+(scss|sass)')
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false 
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(bs.reload({
      stream: true
    }));
});

gulp.task('bs', ['nodemon'], function() {
  var port = process.env.PORT || 5000;
  
  bs.init({
    proxy: 'localhost:' + port,
    files: ['public/**/*.*'],
    notify: false,
    open: false
  });
});

gulp.task('nodemon', function (callback) {
  var started = false;
  
  return plugins.nodemon({
    script: 'server.js'
  }).on('start', function() {
    if (!started) {
      started = true; 
      callback();
    } 
  }).on('restart', function() {
    setTimeout(function() {
      bs.reload({
        stream: false
      });
    }, 500);
  });
});

gulp.task('watch', ['bs'], function() {
  gulp.watch('public/css/**/*.+(scss|sass)', ['sass']);
  gulp.watch('public/js/**/*.js', bs.reload);
  gulp.watch('public/index.html', bs.reload);
});

gulp.task('default', function(callback) {
  runSequence(['bs', 'watch'], callback);
});
