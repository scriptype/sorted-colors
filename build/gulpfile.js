const { src, dest, series, watch } = require('gulp');
const del = require('del');

const { config, tasks } = require('../package.json');
const { makeTask } = require('./util.js');

/* Make sure each task has its key inserted. */
Object.keys(tasks).forEach(key => {
  tasks[key].key = key;
});

/*
 * Tasks loaded from package.json and converted into runnable task functions */
const taskFns = Object.keys(tasks).reduce((obj, key) => {
  obj[key] = makeTask(tasks[key]);
  return obj;
}, {});

/*
 * Array of tasks sorted by their `order` property for running in series.
 */
const orderedTasks =
  // Get all of the processors as an array
  Object.values(tasks)
    // Sort by the order value
    .sort((a, b) => (a.order < b.order ? -1 : 1))
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
  return src([config.srcDir + '**/*.*', '!**/_*.*']).pipe(dest(config.distDir));
}

/*
 * $ npm run build
 * The default build task, running these tasks in series.
 */
const build = series(clean, copyToDist, ...orderedTasks);

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

    watch([config.srcDir + '**/*.*'], series(build, refresh));
  }),

  ...taskFns
};
