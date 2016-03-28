const atRoot = require('postcss-atroot');
const browserSync = require('browser-sync').create();
const clearFix = require('postcss-clearfix');
const colorShort = require('postcss-color-short');
const concat = require('gulp-concat');
const cssMqpacker = require('css-mqpacker');
const cssNano = require('gulp-cssnano');
const cssNext = require('postcss-cssnext');
const cssSorter = require('css-declaration-sorter');
const focus = require('postcss-focus');
const gulp = require('gulp');
const inlineImg = require('postcss-inline-image');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const px2Rem = require('postcss-pxtorem');
const size = require('postcss-size');
const uglify = require('gulp-uglify');
const uncss = require('gulp-uncss');
const watch = require('gulp-watch');

gulp.task('default', ['server'], () => {
  gulp.watch('src/pug/**', (event) => {
    gulp.run('pug');
  });
  gulp.watch('src/postcss/**', (event) => {
    gulp.run('postcss');
  });
  gulp.watch('src/css/**', (event) => {
    gulp.run('css');
  });
  gulp.watch('src/js/**', (event) => {
    gulp.run('js');
  });
});

// Pug

gulp.task('pug', () => {
  gulp.src('src/pug/**/*.pug')
    .pipe(pug({
      pretty: false,
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

// PostCSS

gulp.task('postcss', () => {
  const processors = [
    atRoot,
    colorShort,
    focus,
    size,
    inlineImg,
    clearFix,
    px2Rem,
    cssNext({
      autoprefixer: 'ie >= 7, last 10 versions, > 1%'
    }),
    cssMqpacker,
    cssSorter
  ];
  return gulp.src('src/postcss/*.css')
    .pipe(postcss(processors))
    .pipe(uncss({
      html: ['dist/index.html']
    }))
    .pipe(cssNano())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

// JavaScript

gulp.task('js', () => {
  gulp.src('src/js/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'))
  .pipe(browserSync.stream());
});

// Server

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: false
  });
});
