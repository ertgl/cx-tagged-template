import { fx } from "./fx.mjs";

/**
 * @import {
 *   type TemplateExpression,
 *   type TemplateString,
 * } from "../../src/index.js";
 */

/**
 * @param {string} code
 * @returns {readonly [readonly TemplateString[], readonly TemplateExpression[]]}
 */
export function compileTaggedTemplate(
  code,
)
{
  const escapedCode = code.replace(
    /\\/gu,
    "\\\\",
  ).replace(
    /`/gu,
    "\\`",
  );

  /**
   * @type {(f: typeof fx) => readonly [readonly TemplateString[], readonly TemplateExpression[]]}
   */
  // @ts-expect-error - Testing-only.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const g = new Function(
    "f",
    `return f\`${escapedCode}\`;`,
  );

  return g(fx);
}
