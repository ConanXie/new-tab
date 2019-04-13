/**
 * Transpiles TypeScript to JavaScript code.
 *
 * @link https://github.com/facebook/jest/blob/master/examples/typescript/preprocessor.js
 * @copyright 2004-present Facebook. All Rights Reserved.
 */

const tsc = require("typescript")
const tsConfig = require("../tsconfig.json")

// Use CommonJS module
tsConfig.compilerOptions.module = "commonjs"

module.exports = {
  process(src, path) {
    if (path.endsWith(".ts") || path.endsWith(".tsx")) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, [])
    }
    return src
  },
}
