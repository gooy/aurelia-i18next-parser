var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var del = require('del');
var vinylPaths = require('vinyl-paths');

var dirs = gulp.pkg.directories;

/**
 * Transpile es6 code into the dist directory
 */
gulp.task('build-system', function () {
  return gulp.src(dirs.lib+"/**/*.js")
  .pipe(plumber())
  .pipe(changed(dirs.build, {extension: '.js'}))
  .pipe(sourcemaps.init())
  .pipe(babel(assign({}, compilerOptions, {modules:'system'})))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest(dirs.build+"/system"));
});

/**
 * Transpile es6 code into the dist directory
 */
gulp.task('build-commonjs', function () {
  return gulp.src(dirs.lib+"/**/*.js")
  .pipe(plumber())
  .pipe(changed(dirs.build, {extension: '.js'}))
  .pipe(sourcemaps.init())
  .pipe(babel(assign({}, compilerOptions, {modules:'common'})))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest(dirs.build+"/commonjs"));
});

gulp.task('build-amd', function () {
  return gulp.src(dirs.lib)
  .pipe(babel(assign({}, compilerOptions, {modules:'amd'})))
  .pipe(gulp.dest(dirs.build + '/amd'));
});

gulp.task('build-es6', function () {
  return gulp.src(dirs.lib)
  .pipe(gulp.dest(dirs.build + '/es6'));
});

/**
 * Clean the dist direcotry
 */
gulp.task('clean-dist', function() {
  return gulp.src([gulp.pkg.directories.build])
  .pipe(vinylPaths(del));
});

/**
 * Clean the dist directory first then build the files.
 */
gulp.task('build', function(done) {
  return runSequence(
    'clean-dist',
    ['build-commonjs','build-amd','build-es6','build-system'],
    done
  );
});
