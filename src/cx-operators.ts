import type { Operator } from "./operator";
import {
  OPERATOR_DISCARD,
  OPERATOR_EMIT,
  OPERATOR_TEST,
} from "./operators";

export interface DefaultOperatorsMapping extends OperatorsMapping
{
  discard: typeof OPERATOR_DISCARD;
  emit: typeof OPERATOR_EMIT;
  test: typeof OPERATOR_TEST;
}

export type ExtendedOperatorsMapping<
  T_CustomOperators extends OperatorsMapping,
> = (
  & DefaultOperatorsMapping
  & T_CustomOperators
);

export type OperatorsMapping = Record<string, Operator>;

export function createOperatorsMapping<
  T_CustomOperators extends OperatorsMapping,
>(
  overrides?: null | Partial<T_CustomOperators>,
): ExtendedOperatorsMapping<T_CustomOperators>
{
  return {
    discard: OPERATOR_DISCARD,
    emit: OPERATOR_EMIT,
    test: OPERATOR_TEST,
    ...overrides,
  } as ExtendedOperatorsMapping<T_CustomOperators>;
}
