'use strict';
/* global gulp, path */

var async = require('async'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    rename = require('gulp-rename');

var src = {
  app:
    path.join(__dirname, '..', 'templates', 'app', 'views', 'App.js'),
  appTest:
    path.join(__dirname, '..', 'templates', 'app', 'views', '__tests__', 'App-test.js'),
  page:
    path.join(__dirname, '..', 'templates', 'app', 'views', 'Page.js'),
  pageTest:
    path.join(__dirname, '..', 'templates', 'app', 'views', '__tests__', 'Page-test.js'),
  component:
    path.join(__dirname, '..', 'templates', 'app', 'views', 'Component.js'),
  componentTest:
    path.join(__dirname, '..', 'templates', 'app', 'views', '__tests__', 'Component-test.js')
};

gulp.task('code', function (done) {
  inquirer.prompt([
    { type: 'input',
      name: 'type',
      message: 'What kind of view? [app|page|component]',
      choices: ['app', 'page', 'component'],
      default: 'class'
    },
    { type: 'input',
      name: 'file',
      message: 'Give your view a name',
      default: 'Untitled'
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
      answers.directory, 'views');

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
