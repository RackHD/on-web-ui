'use strict';

var gulp = require('gulp'),
    path = require('path');

var conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer');

var src = path.join(__dirname, 'templates', 'app', '**');

var target = path.join(__dirname, '..', 'apps', 'test');

console.log(src, target);

gulp.task('default', function (done) {
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Give your app a name', default: gulp.args.join(' ')}, // Get app name from arguments by default
    {type: 'confirm', name: 'moveon', message: 'Continue?'}
  ],
  function (answers) {
    if (!answers.moveon) {
      return done();
    }
    gulp.src(src)  // Note use of __dirname to be relative to generator
      .pipe(template(answers))                 // Lodash template support
      .pipe(conflict(target))                    // Confirms overwrites on file conflicts
      .pipe(gulp.dest(target))                   // Without __dirname here = relative to cwd
      .on('end', function () {
        done();                                // Finished!
      })
      .resume();
  });
});


// process.on('uncaughtException', console.error.bind(console));

// global.gulp = require('gulp');
// global.path = require('path');

// global.parameters = require('./lib/parameters')(2);

// global.gulp.task('default', ['app']);

// require('./generators/app');
// require('./generators/asset');
// require('./generators/code');
// require('./generators/config');
// require('./generators/less');
// require('./generators/messenger');
// require('./generators/mixin');
// require('./generators/readme');
// require('./generators/store');
// require('./generators/view');
