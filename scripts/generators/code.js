'use strict';
/* global gulp, path */

var async = require('async'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    rename = require('gulp-rename');

var src = {
  'class':
    path.join(__dirname, '..', 'templates', 'app', 'lib', 'Class.js'),
  classTest:
    path.join(__dirname, '..', 'templates', 'app', 'lib', '__tests__', 'Class-test.js'),
  object:
    path.join(__dirname, '..', 'templates', 'app', 'lib', 'object.js'),
  objectTest:
    path.join(__dirname, '..', 'templates', 'app', 'lib', '__tests__', 'object-test.js'),
  'function':
    path.join(__dirname, '..', 'templates', 'app', 'lib', 'function.js'),
  functionTest:
    path.join(__dirname, '..', 'templates', 'app', 'lib', '__tests__', 'function-test.js')
};

gulp.task('code', function (done) {
  inquirer.prompt([
    { type: 'input',
      name: 'type',
      message: 'What kind of code? [class|object|function]',
      choices: ['class', 'object', 'function'],
      default: 'class'
    },
    { type: 'input',
      name: 'file',
      message: 'Give your code a name',
      default: 'untitled'
    },
    { type: 'input',
      name: 'name',
      message: 'Give your app a name',
      default: gulp.args.join(' ')
    },
    { type: 'input',
      name: 'directory',
      message: 'Use a different directory name?',
      default: function(answers) {
        return answers.name.toLowerCase();
      }
    },
    { type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ],
  function (answers) {
    answers.directory = answers.directory || answers.name;

    if (!(/^[a-z]+/i).test(answers.directory)) {
      throw new Error('Invalid directory name: ' + answers.directory);
    }

    var target = path.join(__dirname, '..', '..', 'apps',
      answers.directory, 'lib');

    var targetTest = path.join(target, '__tests__');

    if (!answers.moveon) {
      return done();
    }

    async.parallel([
      function (next) {
        gulp.src(src[answers.type])
          .pipe(rename(answers.file + '.js'))
          .pipe(template(answers))
          .pipe(conflict(target))
          .pipe(gulp.dest(target))
          .on('end', function () { next(); })
          .resume();
      },
      function (next) {
        gulp.src(src[answers.type + 'Test'])
          .pipe(rename(answers.file + '-test.js'))
          .pipe(template(answers))
          .pipe(conflict(targetTest))
          .pipe(gulp.dest(targetTest))
          .on('end', function () { next(); })
          .resume();
      }
    ], done);
  });
});
