import { createCX } from "cx-tagged-template";
import { createCSSModulesTransformer } from "cx-tagged-template/extensions/css-modules";

/**
 * @import { type CX } from "cx-tagged-template";
 */

export const cx = createCX();

/**
 * @param {Record<string, string>} styles
 * @returns {CX}
 */
export function createCMX(
  styles,
)
{
  return createCX({
    transformer: createCSSModulesTransformer(styles),
  });
}
