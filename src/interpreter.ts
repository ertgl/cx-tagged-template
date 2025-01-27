import type { ClassNameEmitter } from "./class-name-emitter";
import type { Consolidator } from "./consolidator";
import { operate } from "./operation";
import { isOperator } from "./operator";
import type { Parser } from "./parser";
import { type Stack } from "./stack";
import type { TemplateExpression } from "./template-expression";
import type { TemplateString } from "./template-string";
import type { Tokenizer } from "./tokenizer";

export type Interpreter = (
  emitter: ClassNameEmitter,
  parser: Parser,
  tokenizer: Tokenizer,
  consolidator: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
) => void;

export function interpret(
  emit: ClassNameEmitter,
  parse: Parser,
  tokenizer: Tokenizer,
  consolidator: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
): void
{
  const stack: Stack = {
    values: [],
  };

  parse(
    (value) =>
    {
      if (isOperator(value))
      {
        operate(value, stack, emit);
      }
      else
      {
        stack.values.push(value);
      }
    },
    tokenizer,
    consolidator,
    strings,
    expressions,
  );
}
