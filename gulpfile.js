const browserSync = require('browser-sync').create();
const clearFix = require('postcss-clearfix');
const colorShort = require('postcss-color-short');
const cssMqpacker = require('css-mqpacker');
const cssNano = require('gulp-cssnano');
const cssNext = require('postcss-cssnext');
const cssSorter = require('css-declaration-sorter');
const focus = require('postcss-focus');
const gulp = require('gulp');
const imageOp = require('gulp-image-optimization');
const inlineImg = require('postcss-inline-image');
const inlineSvg = require('postcss-inline-svg');
const instagram = require('postcss-instagram');
const nested = require('postcss-nested');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const px2Rem = require('postcss-pxtorem');
const size = require('postcss-size');
const uncss = require('gulp-uncss');
const watch = require('gulp-watch');

gulp.task('default', ['server'], () => {
  gulp.watch('src/pug/**', (event) => {
    gulp.run('pug');
  });
  gulp.watch('src/postcss/**', (event) => {
    gulp.run('postcss');
  });
});

gulp.task('build', () => {
  gulp.run('pug', 'postcss', 'images', 'move');
});

// Pug

gulp.task('pug', () => {
  gulp.src('src/pug/index.pug')
    .pipe(pug({
      pretty: false,
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

// PostCSS

gulp.task('postcss', () => {
  const processors = [
    nested,
    colorShort,
    focus,
    size,
    inlineImg,
    inlineSvg,
    instagram,
    clearFix,
    px2Rem,
    cssNext({
      autoprefixer: ['ie >= 7', 'last 10 versions', '> 1%']
    }),
    cssMqpacker,
    cssSorter
  ];
  return gulp.src('src/postcss/style.css')
    .pipe(postcss(processors))
    .pipe(uncss({
      html: ['dist/index.html']
    }))
    .pipe(cssNano())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

// Images

gulp.task('images', (cb) => {
  gulp.src(['src/images/**/*'])
  .pipe(imageOp({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

// Moving

gulp.task('move', () => {
  const filesToMove = [
    './src/fonts/**/*.*',
    './src/favicon.ico'
  ];
  gulp.src(filesToMove, { base: './src/' })
  .pipe(gulp.dest('./dist/'));
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
