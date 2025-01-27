import type { TokenEmitter } from "./token-emitter";
import {
  createCharacterToken,
  createEOFToken,
  createLineFeedToken,
  createWhitespaceToken,
  LINE_FEED,
  WHITESPACE_REGEXP,
} from "./tokens";

export type Tokenizer = (
  emitter: TokenEmitter,
  input: string,
) => void;

export function tokenize(
  emit: TokenEmitter,
  input: string,
): void
{
  for (let index = 0; index < input.length; index++)
  {
    const character = input[index];

    if (character === LINE_FEED)
    {
      emit(
        createLineFeedToken(
          index,
        ),
      );
    }
    else if (character.match(WHITESPACE_REGEXP) != null)
    {
      emit(
        createWhitespaceToken(
          index
          , character,
        ),
      );
    }
    else
    {
      emit(
        createCharacterToken(
          index,
          character,
        ),
      );
    }
  }

  emit(
    createEOFToken(
      input.length,
    ),
  );
}
