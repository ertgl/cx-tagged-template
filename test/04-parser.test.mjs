import {
  deepStrictEqual,
  strictEqual,
} from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { formatSource } from "./shared/source.mjs";
import { SNAPSHOT_MIXED } from "./snapshots/mixed.mjs";

await describe(
  "parser",
  async (s) =>
  {
    await test(
      "mixed snapshot",
      async (t) =>
      {
        for (const [source, snapshotData] of Object.entries(SNAPSHOT_MIXED))
        {
          const testName = formatSource(source);
          const data = snapshotData.getParsingSegment();

          strictEqual(
            data.actual.values.length,
            data.expected.values.length,
            `Expected ${String(data.expected.values.length)} value(s), but got ${String(data.actual.values.length)}.`,
          );

          await t.test(
            testName,
            (st) =>
            {
              for (const [index, value] of data.actual.values.entries())
              {
                const expected = data.expected.values[index];

                if (
                  (
                    typeof value === "function"
                    && typeof expected === "function"
                  )
                  || (
                    typeof value === "symbol"
                    && typeof expected === "symbol"
                  )
                )
                {
                  continue;
                }

                deepStrictEqual(
                  value,
                  data.expected.values[index],
                  `Expected parsed value to match.`,
                );
              }
            },
          );
        }
      },
    );
  },
);
