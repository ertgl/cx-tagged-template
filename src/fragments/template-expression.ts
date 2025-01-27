import type { Fragment } from "../fragment";
import type { TemplateExpression } from "../template-expression";

export const FRAGMENT_TYPE_TEMPLATE_EXPRESSION = "template-expression";

export interface TemplateExpressionFragment extends Fragment
{
  type: typeof FRAGMENT_TYPE_TEMPLATE_EXPRESSION;
  value: TemplateExpression;
}

export function createTemplateExpressionFragment(
  index: number,
  value: TemplateExpression,
): TemplateExpressionFragment
{
  return {
    index,
    type: FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
    value,
  };
}

export function isTemplateExpressionFragment(
  fragment: Fragment,
): fragment is TemplateExpressionFragment
{
  return fragment.type === FRAGMENT_TYPE_TEMPLATE_EXPRESSION;
}
