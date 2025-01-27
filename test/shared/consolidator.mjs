import { consolidate } from "cx-tagged-template";

/**
 * @import {
 *   type Fragment,
 *   type TemplateExpression,
 *   type TemplateString,
 * } from "../../src/index.js"
 */

/**
 * @param {readonly [readonly TemplateString[], readonly TemplateExpression[]]} rawFragments
 * @returns {Fragment[]}
 */
export function collectConsolidatedFragments(
  rawFragments,
)
{
  /**
   * @type {Fragment[]}
   */
  const fragments = [];

  consolidate(
    fragments.push.bind(fragments),
    ...rawFragments,
  );

  return fragments;
}
