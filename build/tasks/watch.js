var gulp = require('gulp');
var dirs = gulp.pkg.directories;

gulp.task('watch', function() {
  gulp.watch(dirs.lib+"/**/*.js", ['build-commonjs']).on('change', reportChange);
});

// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}
