const gulp = require('gulp');
const { series, parallel } = require('gulp');

// Import tasks
const { markup } = require('./markup');
const { images } = require('./images');
const { less } = require('./less');
const { vendor } = require('./vendor');
const { browserify } = require('./browserify');

// Define the build task
const build = parallel(markup, images, less, vendor, browserify);

// Export the build task
gulp.task('build', build);

module.exports = {
  build: build
};
