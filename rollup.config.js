import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import sass from "rollup-plugin-sass";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import pkg from "./package.json";
import { writeFileSync } from "fs";

const production = !process.env.ROLLUP_WATCH;

export default [
  // browser-friendly UMD build
  {
    input: "src/index.js",
    output: [
      {
        name: "Tribute",
        file: pkg.main,
        format: "umd"
      },
      {
        name: "Tribute",
        file: pkg.browser,
        format: "umd",
        sourcemap: true,
        plugins: [terser()]
      },
      {
        name: "Tribute",
        file: "example/tribute.js",
        format: "umd"
      }
    ],
    plugins: [
      sass({
        output(styles) {
          writeFileSync("dist/tribute.css", styles);
          writeFileSync("example/tribute.css", styles);
        }
      }),
      resolve(),
      commonjs(),
      babel({
        exclude: ["node_modules/**"]
      }),
      !production && serve({ openPage: "/", contentBase: ["example"] }),
      !production &&
        livereload({
          watch: ["dist", "example/*.html"]
        })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.js",
    output: [{ file: pkg.module, format: "es" }],
    plugins: [sass({ output: "tribute.css" })]
  }
];
