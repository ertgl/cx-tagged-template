import type { Token } from "../token";

export const TOKEN_TYPE_LINE_FEED = "line-feed";

export const LINE_FEED = "\n";

export interface LineFeedToken extends Token
{
  type: typeof TOKEN_TYPE_LINE_FEED;
  value: typeof LINE_FEED;
}

export function createLineFeedToken(
  index: number,
): LineFeedToken
{
  return {
    index,
    type: TOKEN_TYPE_LINE_FEED,
    value: LINE_FEED,
  };
}

export function isLineFeedToken(
  token: Token,
): token is LineFeedToken
{
  return token.type === TOKEN_TYPE_LINE_FEED;
}
