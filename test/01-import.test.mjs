import { strictEqual } from "node:assert";
import { test } from "node:test";

await test(
  "importing the library",
  async (t) =>
  {
    const { createCX } = await import("cx-tagged-template");

    strictEqual(typeof createCX, "function");
  },
);
