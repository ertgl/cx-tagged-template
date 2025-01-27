import {
  consolidate,
  tokenize,
} from "cx-tagged-template";
import {
  isTemplateExpressionFragment,
  isTemplateStringFragment,
} from "cx-tagged-template/fragments";

import { compileTaggedTemplate } from "./template-tag.mjs";

/**
 * @import {
 *   type Fragment,
 *   type Token,
 * } from "../../src/index.js"
 */

/**
 * @param {string} source
 * @returns {Token[]}
 */
export function collectTokens(
  source,
)
{
  /**
   * @type {Token[]}
   */
  const tokens = [];

  const rawFragments = compileTaggedTemplate(source);

  consolidate(
    (
      /**
       * @type {Fragment}
       */
      fragment,
    ) =>
    {
      if (isTemplateStringFragment(fragment))
      {
        tokenize(
          tokens.push.bind(tokens),
          fragment.value,
        );
      }
      else if (
        isTemplateExpressionFragment(fragment)
        && typeof fragment.value === "string"
      )
      {
        tokenize(
          tokens.push.bind(tokens),
          fragment.value,
        );
      }
    },
    rawFragments[0],
    rawFragments[1],
  );

  return tokens;
}
