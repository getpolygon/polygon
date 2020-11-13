const gulp = require("gulp");
const minifyJS = require("gulp-minify");
const cleanCSS = require("gulp-clean-css");

function compressJS() {
  return gulp
    .src(["public/js/**/*.js"], ["public/shared/js/**/*.js"])
    .pipe(minifyJS())
    .pipe(gulp.dest("dist/js"))
    .pipe(gulp.dest("dist/shared/js"))
}

function compressCSS() {
  return gulp
    .src(["public/css/**/*.css"], ["public/shared/css/**/*.css"])
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"))
    .pipe(gulp.dest("dist/shared/css"))
}

exports.default = function () {
  gulp.watch(["public/css/**/*.css", "public/shared/css/**/*.css"], compressCSS);
  gulp.watch(["public/js/**/*.js", "public/shared/js/**/*.js"], compressJS);
};
