import type { ClassName } from "./class-name";
import type { Consolidator } from "./consolidator";
import type { Interpreter } from "./interpreter";
import type { Parser } from "./parser";
import type { TemplateExpression } from "./template-expression";
import type { TemplateString } from "./template-string";
import type { Tokenizer } from "./tokenizer";
import type { Transformer } from "./transformer";

export type Renderer = (
  transformer: null | Transformer | undefined,
  interpreter: Interpreter,
  parser: Parser,
  tokenizer: Tokenizer,
  consolidator: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
) => ClassName;

export function render(
  transform: null | Transformer | undefined,
  interpret: Interpreter,
  parser: Parser,
  tokenizer: Tokenizer,
  consolidator: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
): ClassName
{
  let acc = "";
  let sep = "";

  const seen = new Set<string>();

  interpret(
    (
      transform != null
        ? (className) =>
          {
            className = transform(className);
            if (className === "")
            {
              return;
            }

            if (!seen.has(className))
            {
              acc += sep + className;
              if (sep === "")
              {
                sep = " ";
              }
              seen.add(className);
            }
          }

        : (className) =>
          {
            if (!seen.has(className))
            {
              acc += sep + className;
              if (sep === "")
              {
                sep = " ";
              }
              seen.add(className);
            }
          }

    ),
    parser,
    tokenizer,
    consolidator,
    strings,
    expressions,
  );

  return acc;
}
