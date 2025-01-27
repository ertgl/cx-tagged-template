import type { Fragment } from "../fragment";
import type { TemplateString } from "../template-string";

export const FRAGMENT_TYPE_TEMPLATE_STRING = "template-string";

export interface TemplateStringFragment extends Fragment
{
  type: typeof FRAGMENT_TYPE_TEMPLATE_STRING;
  value: TemplateString;
}

export function createTemplateStringFragment(
  index: number,
  value: TemplateString,
): TemplateStringFragment
{
  return {
    index,
    type: FRAGMENT_TYPE_TEMPLATE_STRING,
    value,
  };
}

export function isTemplateStringFragment(
  fragment: Fragment,
): fragment is TemplateStringFragment
{
  return fragment.type === FRAGMENT_TYPE_TEMPLATE_STRING;
}
