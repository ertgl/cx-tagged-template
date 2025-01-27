import type { ClassName } from "./class-name";
import type { CX } from "./cx";
import {
  createOperatorsMapping,
  type OperatorsMapping,
} from "./cx-operators";
import {
  type Options,
  resolveOptions,
} from "./cx-options";
import type { TemplateExpression } from "./template-expression";

export function createCX<
  T_CustomOperators extends OperatorsMapping = OperatorsMapping,
>(
  options?: null | Options<T_CustomOperators>,
): CX<T_CustomOperators>
{
  const {
    consolidator,
    interpreter,
    parser,
    renderer: render,
    tokenizer,
    transformer,
  } = resolveOptions(
    options,
  );

  function cx(
    strings: TemplateStringsArray,
    ...expressions: readonly TemplateExpression[]
  ): ClassName
  {
    return render(
      transformer,
      interpreter,
      parser,
      tokenizer,
      consolidator,
      strings,
      expressions,
    );
  };

  cx.op = createOperatorsMapping<T_CustomOperators>();

  return cx;
}
