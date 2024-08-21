const newer = require('gulp-newer');
const gulp = require('gulp');
const config = require('../config').images;
const reload = require('../util/bs').reload;

function images() {
  return gulp.src(config.src)
    // Ignore unchanged files
    .pipe(newer(config.dest))
    // .pipe(imagemin()) // Uncomment if you want to use imagemin
    .pipe(gulp.dest(config.dest))
    .pipe(reload({
      stream: true,
    }));
}

exports.images = images;
