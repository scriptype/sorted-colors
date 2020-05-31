const { src, dest, series, watch } = require('gulp');
const del = require('del');

const { config, tasks } = require('../package.json');
const { makeTask } = require('./util.js');

/*
 * Tasks loaded from package.json and converted into runnable task functions */
const taskFns = tasks.reduce((obj, task) => {
  obj[task.key] = makeTask(task);
  return obj;
}, {});

const runnableTasks =
  // Get all of the processors as an array
  tasks
    // Turn into processor tasks
    .map(makeTask)
    // Flatten into a single array
    .reduce((arr, task) => arr.concat(task), []);

/*
 * Remove all files from the dist dir.
 */
function clean(done) {
  del.sync([config.distDir]);
  return done();
}

/*
 * Copy src files to the dist dir for processing. The tasks will cleanup unneeded files.
 */
function copyToDist() {
  return src([config.srcDir + '**/*.*', ...config.copyIgnore]).pipe(dest(config.distDir));
}

/*
 * $ npm run build
 * The default build task, running these tasks in series.
 */
const build = series(clean, copyToDist, ...runnableTasks);

module.exports = {
  default: build,
  build,

  /*
   * $ npm run serve
   * A watch task to run a local server with auto-refreshing when files are changed
   */
  serve: series(build, () => {
    const browserSync = require('browser-sync').create();

    function refresh(done) {
      browserSync.reload();
      done();
    }

    browserSync.init({
      server: config.distDir
    });

    watch([config.srcDir + '**/*.*', ...config.copyIgnore], series(build, refresh));
  }),

  ...taskFns
};
