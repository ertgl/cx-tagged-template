import { strictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { formatSource } from "./shared/source.mjs";
import { SNAPSHOT_MIXED } from "./snapshots/mixed.mjs";

await describe(
  "renderer",
  async (s) =>
  {
    await test(
      "mixed snapshot",
      async (t) =>
      {
        for (const [source, snapshotData] of Object.entries(SNAPSHOT_MIXED))
        {
          const testName = formatSource(source);
          const data = snapshotData.getRenderingSegment();

          await t.test(
            testName,
            (st) =>
            {
              strictEqual(
                data.actual.className,
                data.expected.className,
                "Expected rendered class-names to match.",
              );
            },
          );
        }
      },
    );
  },
);
