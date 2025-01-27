import { strictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { cx } from "cx-tagged-template";

await describe(
  "tagged template",
  async (s) =>
  {
    await test(
      "foo bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar`,
          "foo bar",
        );
      },
    );

    await test(
      "foo bar bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar bar`,
          "foo bar",
        );
      },
    );

    await test(
      "foo bar ${0} bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${0} bar`,
          "bar",
        );
      },
    );

    await test(
      "foo ${cx`nested bar`} bar",
      (t) =>
      {
        strictEqual(
          cx`foo ${cx`nested bar`} bar`,
          "foo nested bar",
        );
      },
    );

    await test(
      "foo bar ${cx`nested bar`} bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${cx`nested bar`} bar`,
          "foo bar nested",
        );
      },
    );

    await test(
      "foo bar <line-feed> bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar \n bar`,
          "foo bar",
        );

        strictEqual(
          cx`foo bar
          bar`,
          "foo bar",
        );
      },
    );

    await test(
      "foo bar ${0} ${cx.op.emit}",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${0} ${cx.op.emit}`,
          "",
        );
      },
    );

    await test(
      "foo bar ${cx.op.emit} ${0}",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${cx.op.emit} ${0}`,
          "foo bar",
        );
      },
    );

    await test(
      "foo bar ${cx.op.discard}",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${cx.op.discard}`,
          "",
        );
      },
    );

    await test(
      "foo bar ${cx.op.discard} bar",
      (t) =>
      {
        strictEqual(
          cx`foo bar ${cx.op.discard} bar`,
          "bar",
        );
      },
    );

    await test(
      "foo <line-feed> bar ${cx.op.discard}",
      (t) =>
      {
        strictEqual(
          cx`foo \n bar ${cx.op.discard}`,
          "foo",
        );

        strictEqual(
          cx`foo
          bar ${
            cx.op.discard
          }`,
          "foo",
        );
      },
    );

    await test(
      "foo <line-feed> bar ${string} ${cx.op.test}",
      (t) =>
      {
        const s0 = "";
        const s1 = "interpolated string";

        strictEqual(
          cx`foo \n bar ${s0} ${cx.op.test}`,
          "foo",
        );

        strictEqual(
          cx`foo \n bar ${s1} ${cx.op.test}`,
          "foo bar interpolated string",
        );
      },
    );
  },
);
