import { strictEqual } from "node:assert";
import {
  describe,
  test,
} from "node:test";

import {
  createCX,
  cx,
  defineOperator,
} from "cx-tagged-template";
import { createCSSModulesTransformer } from "cx-tagged-template/extensions/css-modules";

await describe(
  "README.md",
  async (s) =>
  {
    await test(
      "Example: Using non-string values as conditional expressions",
      (t) =>
      {
        const borderedFalse = false;
        const borderedTrue = true;

        strictEqual(
          cx`
          nice${!borderedFalse}
          bordered ${borderedFalse}
          `,
          "nice",
        );

        strictEqual(
          cx`
          nice${!borderedTrue}
          bordered ${borderedTrue}
          `,
          "bordered",
        );
      },
    );

    await test(
      "Example: Using interpolations for string concatenations",
      (t) =>
      {
        const colors = {
          dark: {
            fg: "white",
          },
          light: {
            fg: "black",
          },
        };

        strictEqual(
          cx`text-${colors.light.fg} dark:text-${colors.dark.fg}`,
          "text-black dark:text-white",
        );
      },
    );

    await test(
      "Example: Using interpolations for dynamic class-names",
      (t) =>
      {
        const flexDirectionNone = "";
        const flexDirectionColumn = "column";

        strictEqual(
          cx`flex ${flexDirectionNone}`,
          "flex",
        );

        strictEqual(
          cx`flex ${flexDirectionColumn}`,
          "flex column",
        );
      },
    );

    await test(
      "Example: Using string interpolations as conditional expressions",
      (t) =>
      {
        const flexDirectionNone = "";
        const flexDirectionColumn = "column";

        strictEqual(
          cx`
          nice
          flex ${flexDirectionNone} ${cx.op.test} box
          `,
          "nice box",
        );

        strictEqual(
          cx`
          nice
          flex ${flexDirectionColumn} ${cx.op.test} box
          `,
          "nice flex column box",
        );
      },
    );

    await test(
      "Example: Emitting values in the stack to the renderer",
      (t) =>
      {
        const flexDirection = "column";

        strictEqual(
          cx`
          nice
          flex ${flexDirection} ${cx.op.emit} box
          `,
          "nice flex column box",
        );
      },
    );

    await test(
      "Example: Discarding values from the stack",
      (t) =>
      {
        const flexDirection = "column";

        strictEqual(
          cx`
          nice
          flex ${flexDirection} ${cx.op.emit} Comment out. ${cx.op.discard} box
          Your lovely important note. ${cx.op.discard}
          `,
          "nice flex column box",
        );
      },
    );

    await test(
      "Example: Deduplicating class-names",
      (t) =>
      {
        strictEqual(
          cx`foo foo bar`,
          "foo bar",
        );
      },
    );

    await test(
      "Example: Transforming class-names with CSS Modules",
      (t) =>
      {
        const styles = {
          foo: "bar",
        };

        const cmx = createCX({
          transformer: createCSSModulesTransformer(styles),
        });

        strictEqual(
          cmx`foo bar`,
          "bar",
        );
      },
    );

    await test(
      "Example: Defining custom operators",
      (t) =>
      {
        cx.op.prefix = defineOperator({
          name: "prefix",
          operate(
            stack,
            emit,
          )
          {
            const prefix = stack.values.pop();
            if (typeof prefix === "string")
            {
              for (let i = 0; i < stack.values.length; i++)
              {
                const value = stack.values[i];
                if (typeof value === "string")
                {
                  stack.values[i] = `${prefix}${value}`;
                }
              }
            }
          },
        });

        strictEqual(
          cx`foo bar the- ${cx.op.prefix}`,
          "the-foo the-bar",
        );
      },
    );

    await test(
      "Usage section",
      (t) =>
      {
        strictEqual(
          cx`nice nice--better ${0} nice--best`,
          "nice--best",
        );
      },
    );
  },
);
