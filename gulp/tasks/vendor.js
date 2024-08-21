const gulp = require('gulp');
const concat = require('gulp-concat');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const configJs = require('../config').vendorJs;
const configCss = require('../config').vendorCss;

function vendorJs() {
  return gulp.src(configJs.src)
    .pipe(newer(configJs.dest + '/' + configJs.outputName))
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(concat(configJs.outputName))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(configJs.dest));
}

function vendorCss() {
  return gulp.src(configCss.src)
    .pipe(newer(configCss.dest + '/' + configCss.outputName))
    .pipe(sourcemaps.init())
    .pipe(concat(configCss.outputName))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(configCss.dest));
}

exports.vendorJs = vendorJs;
exports.vendorCss = vendorCss;
exports.vendor = gulp.parallel(vendorJs, vendorCss);
