import type { ClassNameEmitter } from "./class-name-emitter";
import type { Operator } from "./operator";
import type { Stack } from "./stack";

export function operate(
  operator: Operator,
  stack: Stack,
  emit: ClassNameEmitter,
)
{
  operator(stack, emit);
}
