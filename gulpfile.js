var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var del = require('del');
var imagemin = require('gulp-imagemin');

var jsFilter = filter('**/*.js', {restore: true});
var cssFilter = filter('**/*.css', {restore: true});
var browserSync = require('browser-sync').create();

// testing hello
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


// create browser
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


gulp.task('imagemin', function() {
    var img_src = 'app/images/**/*', img_dest = 'dist/images';
 
    gulp.src(img_src)
    .pipe(changed(img_dest))
    .pipe(imagemin())
    .pipe(gulp.dest(img_dest));
 });


/** default task */
gulp.task('default', function() {
    console.log('gulp js is running');
 });