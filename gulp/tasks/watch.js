/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

const gulp = require('gulp');
const config = require('../config');

function watch(done) {
  const { watchify } = require('./browserify');
  const { browserSync } = require('./browserSync');
  const { lint } = require('./lint');
  const { less } = require('./less');
  const { images } = require('./images');
  const { markup } = require('./markup');

  watchify();
  browserSync();

  gulp.watch(config.lint.js.src, lint);
  gulp.watch(config.less.watch, less);
  gulp.watch(config.images.src, images);
  gulp.watch(config.markup.src, markup);

  // Watchify will watch and recompile our JS, so no need to gulp.watch it
  done();
}

exports.watch = watch;
