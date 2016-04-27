var gulp = require('gulp');
var fs = require('fs');
var exec = require('child_process').exec;
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulpDoxx = require('gulp-doxx');
var path = require('path');
gulp.task('default', ['hint', 'test-cov', 'doc'], function() {
    console.log('DONE!');
});

//coverage
gulp.task('test-cov', function() {
    exec('istanbul cover node_modules/mocha/bin/_mocha', function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
        }
        console.log(stdout);
    });
});

//docs
gulp.task('doc', function() {
    gulp.src(['libs/**/*.js', 'README.md'])
        .pipe(gulpDoxx({
            title: 'yo',
            urlPrefix: path.join(__dirname, "docs")

        }))
        .pipe(gulp.dest('docs'))
});


//jshint
gulp.task('hint', function() {
    return gulp.src(['libs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});