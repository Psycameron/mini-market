const gulp = require("gulp");

require("./gulp/dev");
require("./gulp/docs");

// ============== Default tasks ==============

gulp.task(
  "default",
  gulp.series(
    "clean:dev",
    gulp.parallel("html:dev", "sass:dev", "images:dev", "js:dev"),
    gulp.parallel("watch:dev", "server:dev")
  )
);

gulp.task(
  "docs",
  gulp.series(
    "clean:docs",
    gulp.parallel("html:docs", "sass:docs", "images:docs", "js:docs"),
    gulp.parallel("server:docs")
  )
);
