const { strictEqual } = require("node:assert");
const { test } = require("node:test");

void test(
  "requiring the library",
  (t) =>
  {
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Available after build.
      createCX,
    } = require("cx-tagged-template");

    strictEqual(typeof createCX, "function");
  },
);
