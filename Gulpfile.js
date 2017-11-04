const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');

var base = './doc/';

var input = base + 'assets/main.scss';
var observe = base + '../**/*.scss';
var output = base + '/public';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};


gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    // .pipe(sourcemaps.write())  >> but in current release see next
    .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output))

    // now produce the min version
    .pipe(rename({
        suffix: '.min'
    }))

    .pipe(cssnano())

    .pipe(gulp.dest(output))

    // Release the pressure back and trigger flowing mode (drain)
    // See: http://sassdoc.com/gulp/#drain-event
    .resume();
});



gulp.task('watch', function() {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch(observe, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});



gulp.task('default', ['sass', 'watch' /*, possible other tasks... */]);
gulp.task('build', ['sass', /*, possible other tasks... */]);
