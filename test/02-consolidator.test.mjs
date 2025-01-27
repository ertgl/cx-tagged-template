import {
  deepStrictEqual,
  strictEqual,
} from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { isTemplateExpressionFragment } from "cx-tagged-template/fragments";

import { formatSource } from "./shared/source.mjs";
import { SNAPSHOT_MIXED } from "./snapshots/mixed.mjs";

await describe(
  "consolidator",
  async (s) =>
  {
    await test(
      "mixed snapshot",
      async (t) =>
      {
        for (const [source, snapshotData] of Object.entries(SNAPSHOT_MIXED))
        {
          const testName = formatSource(source);
          const data = snapshotData.getConsolidationSegment();

          await t.test(
            testName,
            (st) =>
            {
              strictEqual(
                data.actual.fragments.length,
                data.expected.fragmentTypes.length,
                `Expected ${String(data.expected.fragmentTypes.length)} fragment(s), but got ${String(data.actual.fragments.length)}.`,
              );

              for (const [index, fragment] of data.actual.fragments.entries())
              {
                const fragmentTypeIndex = Number(isTemplateExpressionFragment(fragment));
                const actualRaw = data.actual.raw[fragmentTypeIndex][fragment.index];
                const expectedRaw = data.expected.raw[fragmentTypeIndex][fragment.index];

                if (
                  !(
                    (
                      typeof actualRaw === "function"
                      && typeof expectedRaw === "function"
                    )
                    || (
                      typeof actualRaw === "symbol"
                      && typeof expectedRaw === "symbol"
                    )
                  )
                )
                {
                  deepStrictEqual(
                    actualRaw,
                    expectedRaw,
                    `Expected raw fragment to match.`,
                  );
                }

                strictEqual(
                  fragment.type,
                  data.expected.fragmentTypes[index],
                  `Expected fragment type to be ${String(data.expected.fragmentTypes[index])}, but got ${String(fragment.type)}.`,
                );
              }
            },
          );
        }
      },
    );
  },
);
