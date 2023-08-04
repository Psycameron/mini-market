const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const serverSettings = {
  livereload: true,
  open: true,
};

const plumberConfig = (title) => {
  return {
    errorHandler: notify.onError({
      title,
      message: "Error <%= error.message %> ",
      sound: false,
    }),
  };
};

gulp.task("html", function () {
  return gulp
    .src("./src/*.html")
    .pipe(plumber(plumberConfig("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sass", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber(plumberConfig("Styles")))
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(sourceMaps.write())
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

gulp.task("watch", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/images/**/*", gulp.parallel("images"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images"),
    gulp.parallel("watch", "server")
  )
);
