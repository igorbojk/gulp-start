var gulp = require('gulp'),
    gulpJade = require('gulp-jade'),
    jade= require('jade'),
    sass = require('gulp-sass'),
    batch = require('gulp-batch'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch');

gulp.task('gulpJade',function(){
    return gulp.src('src/app/**/*.jade')
    .pipe(gulpJade({
            jade: jade,
            pretty: true
        }).on('error', function(err) {
            console.log('\n');
            console.log(err.name + ': ' + err.message);
            console.warn(err.stack, '\n');
            console.log('\n');
        }))
    .pipe(gulp.dest('src/builds/teplates'))
});

gulp.task('sass', function(){
    gulp.src('src/app/style/**/*.+(scss|sass)')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            // cascade: false
        }))
    .pipe(gulp.dest('src/build/style'))
});

gulp.task('watch:html', function(){

    watch('src/**/*.jade', batch(function(events, done){
        gulp.start('gulpJade',done);
    }));

    watch('src/**/*.+(scss|sass)', batch(function(events, done) {
        gulp.start('sass', done);
    }));
});

gulp.task('build', ['sass', 'gulpJade']);

gulp.task('default', ['watch:html']);
