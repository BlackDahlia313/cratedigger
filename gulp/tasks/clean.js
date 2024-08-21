const gulp = require('gulp');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const config = require('../config').clean;

function clean() {
  return gulp.src(config.src, { allowEmpty: true })
    .pipe(vinylPaths(del));
}

exports.clean = clean;
