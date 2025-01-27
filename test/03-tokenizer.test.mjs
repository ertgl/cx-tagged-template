import { strictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { formatSource } from "./shared/source.mjs";
import { SNAPSHOT_MIXED } from "./snapshots/mixed.mjs";

await describe(
  "tokenizer",
  async (s) =>
  {
    await test(
      "mixed snapshot",
      async (t) =>
      {
        for (const [source, snapshotData] of Object.entries(SNAPSHOT_MIXED))
        {
          const testName = formatSource(source);
          const data = snapshotData.getTokenizationSegment();

          await t.test(
            testName,
            (st) =>
            {
              strictEqual(
                data.actual.tokens.length,
                data.expected.tokenTypes.length,
                `Expected ${String(data.expected.tokenTypes.length)} token(s), but got ${String(data.actual.tokens.length)}.`,
              );

              for (const [index, token] of data.actual.tokens.entries())
              {
                strictEqual(
                  token.type,
                  data.expected.tokenTypes[index],
                  `Expected token type "${data.expected.tokenTypes[index]}", but got "${token.type}".`,
                );

                strictEqual(
                  token.value,
                  data.expected.tokenValues[index],
                  `Expected token value "${data.expected.tokenValues[index]}", but got "${token.value}".`,
                );
              }
            },
          );
        }
      },
    );
  },
);
