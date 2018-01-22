var gulp = require('gulp'),
    gulpJade = require('gulp-jade'),
    jade= require('jade'),
    sass = require('gulp-sass'),
    batch = require('gulp-batch'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso');

gulp.task('gulpJade',function(){
    return gulp.src('src/app/template/**/*.jade')
    .pipe(gulpJade({
            jade: jade,
            pretty: true
        }).on('error', function(err) {
            console.log('\n');
            console.log(err.name + ': ' + err.message);
            console.warn(err.stack, '\n');
            console.log('\n');
        }))
    .pipe(gulp.dest('src/build'))
});

gulp.task('sass', function(){
    gulp.src('src/app/style/**/*.+(scss|sass)')

    .pipe(sass({
        includePaths: [
            require('node-normalize-scss').includePaths,
        ]}
    ).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            // cascade: false
        }))
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('src/build/css'))
});

gulp.task('minCss', function(){
    return gulp.src('src/build/css/libs.css')
        .pipe(concat('libs.min.css'))
        .pipe(csso())
        .on('error', function(err){
            console.log('\n');
            console.log(err.name + ': ' + err.message);
            console.warn(err.stack, '\n');
            console.log('\n');
        })
        .pipe(gulp.dest('src/build/css'))
});

gulp.task('scripts', function(){
    return gulp.src('src/app/js/**/*.js') 
        .pipe(concat('libs.js')
        .on('error', function(err){
            console.log('\n');
            console.log(err.name + ': ' + err.message);
            console.warn(err.stack, '\n');
            console.log('\n');
        }))
        .pipe(gulp.dest('src/build/js'))
});

gulp.task('watch', function(){
    
    gulp.watch('src/app/template/**/*.jade', batch(function(events, done){
        gulp.start('gulpJade',done);
    }));

    gulp.watch('src/app/js/**/*.js', batch(function(events, done){
        gulp.start('scripts',done);
    }));

    gulp.watch('src/app/style/**/*.+(scss|sass)', batch(function(events, done) {
        gulp.start('sass', done);
    }));

    gulp.watch('src/build/css/libs.css', batch(function(events, done) {
        gulp.start('minCss', done);
    }));
});

gulp.task('build', ['sass', 'minCss', 'gulpJade', 'scripts']);

gulp.task('default', ['watch']);
