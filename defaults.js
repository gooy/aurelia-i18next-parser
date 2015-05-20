var gulp = require('gulp');
var _ = require('lodash');

//create a pkg variable that hold the package.json with some defaults applied
module.exports.pkg = gulp.pkg = _.merge({
  basePath: __dirname,
  directories: {
    lib: "src",
    build: "dist",
    deploy: "deploy",
    test: "test",
    unit: "test/unit/src",
    e2e: "test/e2e/src",
    doc: "doc",
    doc_output: "docs",
    packages: "jspm_packages",
    node_modules: "node_modules"
  }
},require('package.json'));
