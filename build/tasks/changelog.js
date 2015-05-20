var gulp = require('gulp');
var fs = require('fs');
var changelog = require('conventional-changelog');
var mkdirp = require('mkdirp');

var dirs = gulp.pkg.directories;

/**
 * Generates the changelog from git commit messages.
 */
gulp.task('changelog', function() {

  var outputFile = dirs.doc+'/CHANGELOG.md';
  if(fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  if(!fs.existsSync(dirs.doc)) mkdirp.sync(dirs.doc);

  return changelog({
    repository: gulp.pkg.repository.url,
    version: gulp.pkg.version,
    file: (fs.existsSync(outputFile))? outputFile : null
  }, function(err, log) {
    fs.writeFileSync(outputFile, log);
  });
});
