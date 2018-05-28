const gulp = require("gulp");
const rename = require("gulp-rename");
const sequence = require("gulp-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("@notadd/gulp-typescript");
const tslint = require("gulp-tslint");

const packages = {
    "sms": ts.createProject("src/tsconfig.json"),
};

const dist = "packages";
const source = "src";

const modules = Object.keys(packages);

gulp.task("default", function () {
    tasks();
});

modules.forEach(module => {
    gulp.task(module, () => {
        gulp.src([
            `${source}/**/*.original.graphql`,
            `${source}/*.original.graphql`,
        ]).pipe(rename(function (path) {
            path.basename = path.basename.replace(".original", ".types");
        })).pipe(gulp.dest(`${dist}`));

        return packages[module]
            .src()
            .pipe(tslint({
                formatter: "verbose",
            }))
            .pipe(tslint.report({
                emitError: false,
                summarizeFailureOutput: true,
            }))
            .pipe(sourcemaps.init())
            .pipe(packages[module]())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(dist));
    });
});

gulp.task("build", function (cb) {
    sequence("sms", modules.filter((module) => module !== "sms"), cb);
});

function tasks() {
    modules.forEach(module => {
        watchGraphql(source, module);
        watchTypescript(source, module);
    });
}

function watchGraphql(source, module) {
    gulp.watch(
        [
            `${source}/${module}/**/*.graphql`,
            `${source}/${module}/*.graphql`,
        ],
        [
            module,
        ]
    ).on("change", function (event) {
        console.log("File " + event.path + " was " + event.type + ", running tasks...");
    });
}

function watchTypescript(source, module) {
    gulp.watch(
        [
            `${source}/${module}/**/*.ts`,
            `${source}/${module}/**/*.tsx`,
            `${source}/${module}/*.ts`,
            `${source}/${module}/*.tsx`,
        ],
        [
            module,
        ]
    ).on("change", function (event) {
        console.log("File " + event.path + " was " + event.type + ", running tasks...");
    });
}
