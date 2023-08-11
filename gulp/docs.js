const gulp = require("gulp");
const fs = require("fs");

// HTML
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");

// SASS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const ccso = require("gulp-csso");

// Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");

const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const changed = require("gulp-changed");

// ============== Configs for Gulp tasks ==============

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

// ============== Gulp tasks ==============

gulp.task("html:docs", function () {
  return gulp
    .src("./src/html/**/*.html")
    .pipe(changed("./docs/"))
    .pipe(plumber(plumberConfig("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs/"));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(plumber(plumberConfig("Styles")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(ccso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css/"));
});

gulp.task("images:docs", function () {
  return gulp
    .src("./src/images/**/*")
    .pipe(changed("./docs/images/"))
    .pipe(webp())
    .pipe(gulp.src("./docs/images/"))

    .pipe(gulp.src("./src/images/**/*"))
    .pipe(changed("./docs/images/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/images/"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberConfig("JS")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

// ============== Server tasks ==============

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(server(serverSettings));
});

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean());
  }
  done();
});
