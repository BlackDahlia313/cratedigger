const gulp = require('gulp');
const { series, parallel } = require('gulp');

// Import tasks (assuming they've been updated to Gulp 4 syntax)
const { lint } = require('./lint');
const { less } = require('./less');
const { images } = require('./images');
const { markup } = require('./markup');
const { watch } = require('./watch');

// Define the default task
exports.default = series(
  parallel(lint, less, images, markup),
  watch
);
