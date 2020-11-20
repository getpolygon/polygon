const gulp = require("gulp");
const minify = require("gulp-minify");
const cleanCSS = require("gulp-clean-css");
const gulpSASS = require("gulp-sass");

function compressSharedJS() {
  return gulp
    .src(["public/shared/js/**/*.js"])
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
        noSource: true,
      })
    )
    .pipe(gulp.dest("public/dist/shared/js"));
}

// Compiling Shared SCSS to CSS and Minifying it
function compileSharedSCSS() {
  return gulp
    .src(["public/shared/scss/**/*.scss"])
    .pipe(gulpSASS())
    .pipe(cleanCSS())
    .pipe(gulp.dest("public/dist/shared/css"));
}

// Compiling Main SCSS to CSS and Minifying it
function compileSCSS() {
  compileSharedSCSS();
  return gulp
    .src(["public/scss/**/*.scss"])
    .pipe(gulpSASS())
    .pipe(cleanCSS())
    .pipe(gulp.dest("public/dist/css"));
}

// For minifying JS Files
function compressJS() {
  compressSharedJS();
  return gulp
    .src(["public/js/**/*.js"])
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
        noSource: true,
      })
    )
    .pipe(gulp.dest("public/dist/js"));
}

exports.default = function () {
  compileSCSS();
  compressJS();
  gulp.watch(
    ["public/scss/**/*.scss", "public/shared/scss/**/*.scss"],
    compileSCSS
  );
  gulp.watch(["public/js/**/*.js", "public/shared/js/**/*.js"], compressJS);
};

exports.build = function () {
  return compressJS(), compileSCSS();
};
