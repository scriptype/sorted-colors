const { src, dest, series } = require('gulp');
const rename = require('gulp-rename');
const del = require('del');

const { config } = require('../package.json');

/*
 * Typical PreProcessor workflow
 * Reads files from /src/ directory, runs processes, and outputs to /dist/ directory
 *
 * Pass in a `rename` option to rename the processed files
 * Pass in a `cleanup` parameter to remove unnecessary files
 */
function makeTask(opts) {
  const { key, pipe = [] } = opts;

  function runTask() {
    // Gather the files from the entry directory (dir)
    src(opts.src.map(file => config.srcDir + file), {
      sourcemaps: config.sourcemaps
    }).pipe(dest(config.distDir)); // Copy to the Dist dir

    const filesToModify = src(opts.src.map(file => config.distDir + file), {
      sourcemaps: config.sourcemaps
    }); // Make sure we include any additional files from the dist dir

    const pipes = pipe.map(processor => {
      const fn = require(processor.require);
      return fn.apply(null, processor.args);
    });

    if (opts.rename) {
      pipes.push(makeRename(opts.rename));
    }

    // Pipe the files through the all of the task's functions
    return (
      pipes
        .reduce((stream, processor) => {
          return stream.pipe(processor);
        }, filesToModify)

        // Pipe the output to the destination
        .pipe(
          dest(config.distDir, {
            sourcemaps: '.'
          })
        )
    );
  }

  runTask.displayName = key;

  if (opts.cleanup) {
    return series(runTask, makeCleanup(opts));
  }

  return runTask;
}

/*
 * Rename files in the pipeline.
 */
function makeRename(opts) {
  // Find & replace of the basename if `find` option passed in
  if (opts.find) {
    return rename(function(path) {
      path.basename = path.basename.replace(opts.find, opts.replace);
    });
  }

  return rename(opts);
}

/*
 * Delete unnecessary files in the /dist/ directory
 */
function makeCleanup(opts) {
  function runCleanup(done) {
    const filesToDelete = Array.isArray(opts.cleanup) ? opts.cleanup : opts.src;
    del.sync(filesToDelete.map(file => config.distDir + file));
    done();
  }
  runCleanup.displayName = 'cleanup:' + opts.key;
  return runCleanup;
}

module.exports = {
  makeTask
};
