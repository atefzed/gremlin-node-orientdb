'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    gutil = require('gulp-util');

var dir = 'test/unit/';

gulp.task('mocha', function() {
    return gulp.src([dir + 'test*.js'], {
            read: false
        })
        .pipe(mocha({
            reporter: 'list'
        }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function(){
	gulp.start('mocha');
	gulp.watch(['./**/*.js', dir + '**/*.js'], ['mocha']);
});

gulp.task('default', ['watch-mocha']);