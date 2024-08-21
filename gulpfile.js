/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

const requireDir = require('require-dir');
const gulp = require('gulp');

// Require all tasks in gulp/tasks, including subfolders
const tasks = requireDir('./gulp/tasks', { recurse: true });

// Define the browserify task
gulp.task('browserify', tasks.browserify.browserify);

// Define the default task
exports.default = gulp.series(
  tasks.clean.clean,
  gulp.parallel(
    tasks.less.less,
    tasks.images.images,
    tasks.markup.markup,
    tasks.browserify.browserify
  ),
  tasks.watch.watch
);
