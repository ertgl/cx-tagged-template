import type { FragmentEmitter } from "./fragment-emitter";
import {
  createTemplateExpressionFragment,
  createTemplateFeedFragment,
  createTemplateStringFragment,
} from "./fragments";
import type { TemplateExpression } from "./template-expression";
import type { TemplateString } from "./template-string";

export type Consolidator = (
  emitter: FragmentEmitter,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
) => void;

export function consolidate(
  emit: FragmentEmitter,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
): void
{
  for (let index = 0; index < strings.length; index++)
  {
    const string = strings[index];

    if (string !== "")
    {
      emit(
        createTemplateStringFragment(
          index,
          string,
        ),
      );
    }

    if (index < expressions.length)
    {
      emit(
        createTemplateExpressionFragment(
          index,
          expressions[index],
        ),
      );
    }
  }

  emit(
    createTemplateFeedFragment(
      strings.length,
    ),
  );
}
