import { strictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import { createCX } from "cx-tagged-template";
import { createCSSModulesTransformer } from "cx-tagged-template/extensions/css-modules";

await describe(
  "CSS Modules extension",
  async (s) =>
  {
    await test(
      "createCSSModulesTransformer",
      (t) =>
      {
        const styles = {
          foo: "bar",
        };

        const cx = createCX({
          transformer: createCSSModulesTransformer(styles),
        });

        strictEqual(
          cx`baz ${"foo"} bar`,
          "baz bar",
        );
      },
    );
  },
);
