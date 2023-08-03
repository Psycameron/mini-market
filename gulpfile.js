const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const serverSettings = {
  livereload: true,
  open: true,
};

gulp.task("html", function () {
  return gulp
    .src("./src/*.html")
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sass", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dist/css/"));
});

gulp.task("images", function () {
  return gulp.src("./src/images/**/*").pipe(gulp.dest("./dist/images/"));
});

gulp.task("server", function () {
  return gulp.src("./dist/").pipe(server(serverSettings));
});

gulp.task("clean", function (done) {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean());
  }
  done();
});
