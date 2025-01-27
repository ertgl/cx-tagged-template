import {
  consolidate,
  interpret,
  parse,
  tokenize,
} from "cx-tagged-template";

import { compileTaggedTemplate } from "./template-tag.mjs";

/**
 * @import { type Value } from "../../src/index.js"
 */

/**
 * @param {string} source
 * @returns {Value[]}
 */
export function collectInterpretedValues(
  source,
)
{
  const rawFragments = compileTaggedTemplate(source);

  /**
   * @type {Value[]}
   */
  const values = [];

  interpret(
    values.push.bind(values),
    parse,
    tokenize,
    consolidate,
    rawFragments[0],
    rawFragments[1],
  );

  return values;
}
