import { defineOperator } from "../operator-definition";

export const OPERATOR_EMIT = defineOperator({
  name: "emit",

  operate(
    stack,
    emit,
  )
  {
    for (const value of stack.values)
    {
      if (typeof value === "string" && value.length > 0)
      {
        emit(value);
      }
    }

    stack.values = [];
  },
});
