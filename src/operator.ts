import type { ClassNameEmitter } from "./class-name-emitter";
import type { OperatorMetadata } from "./operator-metadata";
import type { Stack } from "./stack";
import { SYMBOL_OPERATOR } from "./symbol-operator";

export interface Operator extends OperatorFunction
{
  readonly [SYMBOL_OPERATOR]: OperatorMetadata;
}

export type OperatorFunction = {
  (
    stack: Stack,
    emit: ClassNameEmitter,
  ): void;

  [SYMBOL_OPERATOR]?: null | OperatorMetadata;
};

export function isOperator(
  value: unknown,
): value is Operator
{
  return (
    typeof value === "function"
    && (value as OperatorFunction)[SYMBOL_OPERATOR] != null
  );
}
