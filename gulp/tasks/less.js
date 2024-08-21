const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const handleErrors = require('../util/handleErrors');
const config = require('../config').less;
const stream = require('../util/bs').stream;
const autoprefixer = require('gulp-autoprefixer');

function doLess() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(less(config.settings))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(stream({match: '**/*.css'}));
}

exports.less = doLess;
