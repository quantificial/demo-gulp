var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var del = require('del');
var jsFilter = filter('**/*.js', {restore: true});
var cssFilter = filter('**/*.css', {restore: true});


gulp.task('hello', function() {
    console.log("hello...");
});

// sass example
gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
      .pipe(sass()) // Converts Sass to CSS with gulp-sass
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
        stream: true
      }))              
  });

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
    browserSync.init({
    server: {
        baseDir: 'app'
    },
    })
});



gulp.task('combine', function(){

    //var assets = useref.assets({searchPath: './'});
    
    console.log('start combine...');

    return gulp.src('app/*.html')
        //.pipe(assets)
        .pipe(useref())
        .pipe(gulpIf('*.js',uglify()))
        .pipe(gulpIf('*.css',cssnano()))
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});

gulp.task('js', function(){
    return gulp.src('app/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
})

function clean() {
    return del(['dist']);
}
  
// watch the file change
gulp.task('watch', gulp.parallel('browserSync','sass',function(){
    //gulp.watch('app/scss/**/*.scss', ['sass']); 
    gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
    // Other watchers
    //gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', gulp.series(js,browserSync.reload));
    gulp.watch('app/*.html').on('change', browserSync.reload);
}));


