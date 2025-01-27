/**
 * @import {
 *   type TemplateExpression,
 *   type TemplateString,
 * } from "../../src/index.js";
 */

/**
 * @param {TemplateStringsArray} strings
 * @param  {readonly TemplateExpression[]} expressions
 * @returns {readonly [readonly TemplateString[], readonly TemplateExpression[]]}
 */
export function fx(
  strings,
  ...expressions
)
{
  return [strings, expressions];
}
