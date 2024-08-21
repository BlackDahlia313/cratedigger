/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify.bundleConfigs in gulp/config.js
*/

const browserify = require('browserify');
const watchify = require('watchify');
const bundleLogger = require('../util/bundleLogger');
const gulp = require('gulp');
const handleErrors = require('../util/handleErrors');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('../config').browserify;
const reload = require('../util/bs').reload;
const _ = require('lodash');
const sourcemaps = require('gulp-sourcemaps');
const shim = require('browserify-shim');

function browserifyTask(callback, devMode) {
  process.env.BROWSERIFYSWAP_ENV = 'prod';

  config.bundleConfigs.forEach(function external(bundle) {
    bundle.external = config.libs;
  });

  if (!devMode) {
    config.pluginsBundleConfig.require = config.libs;
    if (process.env.NODE_ENV === 'prod') {
      config.pluginsBundleConfig.ignore = config.ignoreInProd;
    }

    config.bundleConfigs.push(config.pluginsBundleConfig);
  }

  let bundleQueue = config.bundleConfigs.length;

  const browserifyThis = function(bundleConfig) {
    if (devMode) {
      // Add watchify args
      _.extend(bundleConfig, watchify.args);
    }

    let b = browserify(bundleConfig).transform(shim, {global: true});

    const bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      let preBundle = b.bundle()
        .on('error', handleErrors)
        .pipe(source(bundleConfig.outputName))
        .pipe(buffer())
        .pipe(sourcemaps.init({
          loadMaps: true,
        }));

      if (!devMode) {
        preBundle = preBundle.pipe(uglify());
      }

      return preBundle
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
        .pipe(reload({
          stream: true,
        }));
    };

    if (devMode) {
      // Wrap with watchify and rebundle on changes
      b = watchify(b);

      // Rebundle on update
      b.on('update', bundle);
      bundleLogger.watch(bundleConfig.outputName);
    }

    // Sort out shared dependencies.
    // b.require exposes modules externally
    if (bundleConfig.require) b.require(bundleConfig.require);

    // b.external excludes modules from the bundle, and expects
    // they'll be available externally
    if (bundleConfig.external) b.external(bundleConfig.external);

    // ignore modules and replace them with an empty object
    if (bundleConfig.ignore) {
      bundleConfig.ignore.forEach(function ignoreModule(module) {
        b.ignore(module);
      });
    }

    const reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName);

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis);
}

function browserifyWithLint(callback) {
  const { lintFail } = require('./lint');
  return gulp.series(lintFail, (cb) => browserifyTask(cb, false))(callback);
}

exports.browserify = browserifyWithLint;
exports.watchify = (callback) => browserifyTask(callback, true);
