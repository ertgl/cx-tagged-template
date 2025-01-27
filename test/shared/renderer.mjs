import {
  consolidate,
  interpret,
  parse,
  render,
  tokenize,
} from "cx-tagged-template";

import { compileTaggedTemplate } from "./template-tag.mjs";

/**
 * @import { type ClassName } from "../../src/index.js"
 */

/**
 * @param {string} source
 * @returns {ClassName}
 */
export function getRenderedClassName(
  source,
)
{
  const rawFragments = compileTaggedTemplate(source);

  return render(
    null,
    interpret,
    parse,
    tokenize,
    consolidate,
    rawFragments[0],
    rawFragments[1],
  );
}
