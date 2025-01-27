import type { Token } from "../token";

export const TOKEN_TYPE_EOF = "eof";

export const EOF = "";

export interface EOFToken extends Token
{
  type: typeof TOKEN_TYPE_EOF;
  value: typeof EOF;
}

export function createEOFToken(
  index: number,
): EOFToken
{
  return {
    index,
    type: TOKEN_TYPE_EOF,
    value: EOF,
  };
}

export function isEOFToken(
  token: Token,
): token is EOFToken
{
  return token.type === TOKEN_TYPE_EOF;
}
