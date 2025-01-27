import type { Token } from "../token";

export const TOKEN_TYPE_WHITESPACE = "whitespace";

export const WHITESPACE_REGEXP = /\s/;

export interface WhitespaceToken extends Token
{
  type: typeof TOKEN_TYPE_WHITESPACE;
  value: string;
}

export function createWhitespaceToken(
  index: number,
  value: string,
): WhitespaceToken
{
  return {
    index,
    type: TOKEN_TYPE_WHITESPACE,
    value,
  };
}

export function isWhitespaceToken(
  token: Token,
): token is WhitespaceToken
{
  return token.type === TOKEN_TYPE_WHITESPACE;
}
