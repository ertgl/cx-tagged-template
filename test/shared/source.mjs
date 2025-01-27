import { DATASET_WHITESPACES } from "../datasets/whitespaces.mjs";

/**
 * @param {string} source
 * @returns {string}
 */
export function formatSource(
  source,
)
{
  if (source === "")
  {
    return "<empty-string>";
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (DATASET_WHITESPACES[source] != undefined)
  {
    return DATASET_WHITESPACES[source];
  }
  return source;
}
