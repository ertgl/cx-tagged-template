import type { Token } from "../token";

export const TOKEN_TYPE_CHARACTER = "character";

export interface CharacterToken extends Token
{
  type: typeof TOKEN_TYPE_CHARACTER;
  value: string;
}

export function createCharacterToken(
  index: number,
  value: string,
): CharacterToken
{
  return {
    index,
    type: TOKEN_TYPE_CHARACTER,
    value,
  };
}

export function isCharacterToken(
  token: Token,
): token is CharacterToken
{
  return token.type === TOKEN_TYPE_CHARACTER;
}
