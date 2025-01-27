import type { Consolidator } from "./consolidator";
import {
  isTemplateExpressionFragment,
  isTemplateFeedFragment,
  isTemplateStringFragment,
} from "./fragments";
import {
  OPERATOR_EMIT,
  OPERATOR_TEST,
} from "./operators";
import type { TemplateExpression } from "./template-expression";
import type { TemplateString } from "./template-string";
import type { Token } from "./token";
import type { TokenEmitter } from "./token-emitter";
import type { Tokenizer } from "./tokenizer";
import {
  isCharacterToken,
  isEOFToken,
  isLineFeedToken,
  isWhitespaceToken,
} from "./tokens";
import type { ValueEmitter } from "./value-emitter";

export type Parser = (
  emitter: ValueEmitter,
  tokenizer: Tokenizer,
  consolidator: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
) => void;

export function parse(
  emit: ValueEmitter,
  tokenize: Tokenizer,
  consolidate: Consolidator,
  strings: readonly TemplateString[],
  expressions: readonly TemplateExpression[],
): void
{
  let buffer = "";
  let interpolating = false;

  const createTokenHandler = (
    interpolated: boolean,
  ): TokenEmitter =>
  {
    return (
      token: Token,
    ): void =>
    {
      interpolating ||= interpolated;

      if (isCharacterToken(token))
      {
        buffer += token.value;
      }
      else if (isLineFeedToken(token))
      {
        flushBuffer();
        emit(OPERATOR_EMIT);
      }
      else if (isWhitespaceToken(token))
      {
        flushBuffer();
      }
      else if (isEOFToken(token))
      {
        if (interpolating)
        {
          interpolating = interpolated;
        }
      }
      else
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeof process?.emitWarning === "function")
        {
          const err = new Error("cx-tagged-template: Invalid token type.");
          err.cause = token;
          process.emitWarning(
            err,
            {
              code: "CX_TAGGED_TEMPLATE_INVALID_TOKEN",
              detail: "The `cause` property of this warning contains the invalid token object.",
            },
          );
        }
      }
    };
  };

  const flushBuffer = (): void =>
  {
    if (interpolating || buffer !== "")
    {
      emit(buffer);
      buffer = "";
      interpolating = false;
    }
  };

  consolidate(
    (fragment) =>
    {
      if (isTemplateStringFragment(fragment))
      {
        tokenize(
          createTokenHandler(false),
          fragment.value,
        );
      }
      else if (isTemplateExpressionFragment(fragment))
      {
        const { value } = fragment;

        if (typeof value === "string")
        {
          tokenize(
            createTokenHandler(true),
            value,
          );
        }
        else
        {
          flushBuffer();
          emit(value);
          emit(OPERATOR_TEST);
        }
      }
      else if (isTemplateFeedFragment(fragment))
      {
        flushBuffer();
        emit(OPERATOR_EMIT);
      }
      else
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeof process?.emitWarning === "function")
        {
          const err = new Error("cx-tagged-template: Invalid fragment type.");
          err.cause = fragment;
          process.emitWarning(
            err,
            {
              code: "CX_TAGGED_TEMPLATE_INVALID_FRAGMENT",
              detail: "The `cause` property of this warning contains the invalid fragment object.",
            },
          );
        }
      }
    },
    strings,
    expressions,
  );
}
