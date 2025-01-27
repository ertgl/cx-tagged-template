/**
 * @param {string} source
 * @returns {unknown}
 */
export function compileExpression(
  source,
)
{
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
  return Function("return " + source)();
}
