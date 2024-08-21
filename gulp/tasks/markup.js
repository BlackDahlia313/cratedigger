const gulp = require('gulp');
const newer = require('gulp-newer');
const config = require('../config').markup;
const reload = require('../util/bs').reload;

function markup() {
  return gulp.src(config.src)
    .pipe(newer(config.dest))
    .pipe(gulp.dest(config.dest))
    .pipe(reload({stream:true}));
}

exports.markup = markup;
