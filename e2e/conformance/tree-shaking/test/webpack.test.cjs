const { ok } = require("node:assert");
const {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  resolve: resolvePath,
} = require("node:path");
const {
  describe,
  it,
} = require("node:test");

const TerserWebpackPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

/**
 * @import {
 *   type Configuration as WebpackConfiguration,
 *   type Stats as WebpackStats,
 * } from "webpack";
 */

const SRC_DIR_PATH = resolvePath(
  __dirname,
  "..",
  "src",
);

const OUTPUT_ROOT_DIR_PATH = resolvePath(
  __dirname,
  "..",
  "output",
);

const OPTIMIZED_OUTPUT_DIR_PATH = resolvePath(
  OUTPUT_ROOT_DIR_PATH,
  "optimized",
);

const UNOPTIMIZED_OUTPUT_DIR_PATH = resolvePath(
  OUTPUT_ROOT_DIR_PATH,
  "unoptimized",
);

/**
 * @param {WebpackConfiguration} config
 * @returns {Promise<WebpackStats>}
 */
async function compileWebpack(
  config,
)
{
  return new Promise(
    (resolve, reject) =>
    {
      webpack(
        config,
        (err, stats) =>
        {
          if (err != null)
          {
            reject(err);
            return;
          }
          else if (stats == null)
          {
            reject(new Error("No webpack stats provided"));
            return;
          }

          if (stats.hasErrors())
          {
            const err = new Error("Webpack compilation failed");
            err.cause = stats;
            reject(err);
            return;
          }
          else
          {
            resolve(stats);
          }
        },
      );
    },
  );
}

/**
 * @param {boolean} shouldOptimize
 * @returns {WebpackConfiguration}
 */
function createWebpackConfig(
  shouldOptimize,
)
{
  /**
   * @type {WebpackConfiguration}
   */
  return {
    bail: true,
    devtool: false,
    entry: {
      main: {
        import: resolvePath(
          SRC_DIR_PATH,
          (
            shouldOptimize
              ? "entry-optimized.js"
              : "entry.js"
          ),
        ),
      },
    },
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin(),
      ],
      sideEffects: true,
      usedExports: true,
    },
    output: {
      clean: true,
      path: (
        shouldOptimize
          ? OPTIMIZED_OUTPUT_DIR_PATH
          : UNOPTIMIZED_OUTPUT_DIR_PATH
      ),
    },
    target: "web",
  };
}

void describe(
  "webpack",
  async (s) =>
  {
    await it(
      "should be able to eliminate dead code",
      async (t) =>
      {
        const config = createWebpackConfig(false);
        const optimizedConfig = createWebpackConfig(true);

        const stats = await compileWebpack(config);
        const optimizedStats = await compileWebpack(optimizedConfig);

        const statsJSON = stats.toJson();
        const optimizedStatsJSON = optimizedStats.toJson();

        ok(statsJSON.assets != null, "Expected stats to have assets");
        ok(optimizedStatsJSON.assets != null, "Expected optimized stats to have assets");

        const unoptimizedSize = statsJSON.assets[0].size;
        const optimizedSize = optimizedStatsJSON.assets[0].size;

        t.diagnostic(`Unoptimized size: ${String(unoptimizedSize)} bytes`);
        t.diagnostic(`Optimized size: ${String(optimizedSize)} bytes`);

        ok(
          unoptimizedSize > optimizedSize,
          `
          Expected optimized size to be smaller than unoptimized size,
          but got ${String(unoptimizedSize)} <= ${String(optimizedSize)}
          `,
        );
      },
    );
  },
);
