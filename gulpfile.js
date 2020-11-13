"use strict";
const gulp = require("gulp");
const { watch, dest } = require("gulp");
const minify = require("gulp-minify");
const cleanCSS = require("gulp-clean-css");
const gulpSASS = require("gulp-sass");

// For minifying JS Files
function compressJS() {
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
    .pipe(dest("lib/js"));
}

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
    .pipe(dest("lib/shared/js"));
}

// Compiling Main SCSS to CSS and Minifying it
function compileSCSS() {
  return gulp
    .src(["public/scss/**/*.scss"])
    .pipe(gulpSASS())
    .pipe(cleanCSS())
    .pipe(dest("lib/css"));
}

// Compiling Shared SCSS to CSS and Minifying it
function compileSharedSCSS() {
  return gulp
    .src(["public/shared/scss/**/*.scss"])
    .pipe(gulpSASS())
    .pipe(cleanCSS())
    .pipe(dest("lib/shared/css"));
}

exports.default = function () {
  compressJS();
  compressSharedJS();
  compileSCSS();
  compileSharedSCSS();
  watch(["public/scss/**/*.scss", "public/shared/scss/**/*.scss"], () => {
    compileSCSS();
    compileSharedSCSS();
  });
  watch(["public/js/**/*.js", "public/shared/js/**/*.js"], () => {
    compressJS();
    compressSharedJS();
  });
};
