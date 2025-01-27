import { defineOperator } from "../operator-definition";

export const OPERATOR_DISCARD = defineOperator({
  name: "discard",

  operate(
    stack,
    emit,
  )
  {
    stack.values = [];
  },
});
