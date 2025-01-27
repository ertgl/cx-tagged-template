import { defineOperator } from "../operator-definition";

export const OPERATOR_TEST = defineOperator({
  name: "test",

  operate(
    stack,
    emit,
  )
  {
    const lastValue = stack.values[stack.values.length - 1];

    if (!lastValue)
    {
      stack.values = [];
    }
    else if (typeof lastValue === "string")
    {
      if (lastValue === "")
      {
        stack.values[stack.values.length - 1] = null;
      }
    }
    else
    {
      stack.values[stack.values.length - 1] = null;
    }
  },
});
