import { deepStrictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { formatSource } from "./shared/source.mjs";
import { SNAPSHOT_MIXED } from "./snapshots/mixed.mjs";

await describe(
  "interpreter",
  async (s) =>
  {
    await test(
      "mixed snapshot",
      async (t) =>
      {
        for (const [source, snapshotData] of Object.entries(SNAPSHOT_MIXED))
        {
          const testName = formatSource(source);
          const data = snapshotData.getInterpretationSegment();

          await t.test(
            testName,
            (st) =>
            {
              deepStrictEqual(
                data.actual.values,
                data.expected.values,
                "Expected interpreted values to match.",
              );
            },
          );
        }
      },
    );
  },
);
