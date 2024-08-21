const gulp = require('gulp');
const jscs = require('gulp-jscs');
const eslint = require('gulp-eslint');
const handleErrors = require('../util/handleErrors');
const config = require('../config').lint;

function doLint() {
  return gulp.src(config.js.src)
    .pipe(jscs())
    .on('error', handleErrors)
    .pipe(eslint())
    .pipe(eslint.format());
}

function lintFail() {
  return doLint().pipe(eslint.failOnError());
}

exports.lint = doLint;
exports.lintFail = lintFail;
