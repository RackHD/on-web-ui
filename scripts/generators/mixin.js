'use strict';
/* global gulp, path */

var conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer');

var src = {
  html: path.join(__dirname, '..', 'templates', 'app', 'assets*', 'index.html'),
  json: path.join(__dirname, '..', 'templates', 'app', 'assets*', 'basic.json')
};

gulp.task('mixin', function (done) {
  inquirer.prompt([
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

    var target = path.join(__dirname, '..', '..', 'apps', answers.directory);

    if (!answers.moveon) {
      return done();
    }

    gulp.src(src)
      .pipe(template(answers))
      .pipe(conflict(target))
      .pipe(gulp.dest(target))
      .on('end', function () { done(); })
      .resume();
  });
});
