import type { ClassName } from "./class-name";
import type {
  ExtendedOperatorsMapping,
  OperatorsMapping,
} from "./cx-operators";
import type { TemplateExpression } from "./template-expression";

export type CX<
  T_CustomOperators extends OperatorsMapping = OperatorsMapping,
> = {
  (
    strings: TemplateStringsArray,
    ...expressions: readonly TemplateExpression[]
  ): ClassName;

  readonly op: ExtendedOperatorsMapping<T_CustomOperators>;
};
