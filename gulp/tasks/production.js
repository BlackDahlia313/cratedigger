const gulp = require('gulp');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const config = require('../config').production;

function production() {
  return gulp.src(config.src)
    .pipe(vinylPaths(del))
    .pipe(gulp.dest(config.dest));
}

exports.production = production;
