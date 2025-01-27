import {
  type Operator,
  type OperatorFunction,
} from "./operator";
import { SYMBOL_OPERATOR } from "./symbol-operator";

export type OperatorDefinition = {
  name?: null | string;
  operate: OperatorFunction;
};

export function defineOperator(
  definition: OperatorDefinition,
): Operator
{
  const {
    name,
    operate,
  } = definition;

  operate[SYMBOL_OPERATOR] = {
    name: name ?? "",
  };

  return operate as Operator;
}
