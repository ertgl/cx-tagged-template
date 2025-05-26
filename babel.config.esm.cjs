/**
 * @import { type TransformOptions } from "@babel/core";
 *
 * @import {
 *   type Options as ImportSourceTransformerPluginOptions,
 * } from "babel-plugin-transform-import-source";
 */

const TARGET_EXTENSION = ".mjs";

/**
 * @type {ImportSourceTransformerPluginOptions}
 */
const importSourceTransformerPluginOptions = {
  transform: {
    rules: [
      {
        find: /(?:\.[cm]?[jt]s[x]?)?$/iu,
        replace: TARGET_EXTENSION,
        resolveIndex: {
          fallback: "index",
        },
        test: /^[.\\/]+.*$/,
      },
    ],
  },
};

/**
 * @type {TransformOptions}
 */
module.exports = {
  plugins: [
    [
      require.resolve("babel-plugin-transform-import-source"),
      importSourceTransformerPluginOptions,
    ],
  ],

  presets: [
    [
      require.resolve("@babel/preset-env"),
      {
        modules: false,
      },
    ],

    [
      require.resolve("@babel/preset-typescript"),
      {},
    ],
  ],

  sourceMaps: true,
};
