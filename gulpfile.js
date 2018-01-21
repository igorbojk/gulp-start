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
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            // cascade: false
        }))
    .pipe(gulp.dest('src/app/libs/style'))
});

gulp.task('style', function(){
    return gulp.src('src/app/libs/style/**/*.css')
        .pipe(concat('libs.css')
        .on('error', function(err){
            console.log('\n');
            console.log(err.name + ': ' + err.message);
            console.warn(err.stack, '\n');
            console.log('\n');
        }))
        .pipe(csso())
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
        .pipe(browserSync.reload({stream: true}));
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

    gulp.watch('src/app/libs/style/**/*.css', batch(function(events, done) {
        gulp.start('style', done);
    }));
});

gulp.task('build', ['sass',  'gulpJade', 'style']);

gulp.task('default', ['watch']);
