import {
  FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
  FRAGMENT_TYPE_TEMPLATE_FEED,
  FRAGMENT_TYPE_TEMPLATE_STRING,
} from "cx-tagged-template/fragments";
import {
  OPERATOR_EMIT,
  OPERATOR_TEST,
} from "cx-tagged-template/operators";
import {
  LINE_FEED,
  TOKEN_TYPE_CHARACTER,
  TOKEN_TYPE_EOF,
  TOKEN_TYPE_LINE_FEED,
  TOKEN_TYPE_WHITESPACE,
  WHITESPACE_REGEXP,
} from "cx-tagged-template/tokens";

import { DATASET_DIGITS } from "../datasets/digits.mjs";
import { DATASET_IMPLICIT_CONDITIONALS } from "../datasets/implicit-conditionals.mjs";
import { DATASET_PUNCTUATION } from "../datasets/punctuation.mjs";
import { DATASET_TAILWINDCSS_CLASS_NAMES } from "../datasets/tailwindcss.mjs";
import { DATASET_WHITESPACES } from "../datasets/whitespaces.mjs";
import { collectConsolidatedFragments } from "../shared/consolidator.mjs";
import { compileExpression } from "../shared/expression-compiler.mjs";
import { collectInterpretedValues } from "../shared/interpreter.mjs";
import { collectParsedValues } from "../shared/parser.mjs";
import { getRenderedClassName } from "../shared/renderer.mjs";
import { compileTaggedTemplate } from "../shared/template-tag.mjs";
import { collectTokens } from "../shared/tokenizer.mjs";

/**
 * @import { type SnapshotData } from "../shared/snapshot-data.mjs";
 */

/**
 * @param {(source: string) => SnapshotData} createSnapshotData
 * @returns {(accumulator: Record<string, SnapshotData>, source: string) => Record<string, SnapshotData>}
 */
function createReducer(
  createSnapshotData,
)
{
  return (
    accumulator,
    source,
  ) =>
  {
    const data = createSnapshotData(source);
    accumulator[data.source] = data;
    return accumulator;
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForDualEdgeInterpolation(source)
{
  const finalSource = "${\"prefix:\"}" + source + "${\":suffix\"}";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["", source, ""],
            ["prefix:", ":suffix"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix:" + source + ":suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForLeadingInterpolation(source)
{
  const finalSource = "${\"prefix:\"}" + source;

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["", source],
            ["prefix:"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source, OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix:" + source,
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForLeadingInterpolationSeparatedByWhitespaces(source)
{
  const finalSource = "${\"prefix:\"}" + " " + source;

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["", " " + source],
            ["prefix:"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:", source],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:", source, OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix:" + " " + source,
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
        TOKEN_TYPE_WHITESPACE,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
        " ",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForSequentialInterpolations(source)
{
  const quote = source.includes("\"") ? "'" : "\"";
  const finalSource = "${\"prefix:\"}" + "${" + quote + source + quote + "}" + "${\":suffix\"}";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["", "", "", ""],
            ["prefix:", source, ":suffix"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix:" + source + ":suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForSequentialInterpolationsSeparatedByWhitespaces(source)
{
  const quote = source.includes("\"") ? "'" : "\"";
  const finalSource = "${\"prefix:\"}" + " " + "${" + quote + source + quote + "}" + " " + "${\":suffix\"}";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["", " ", " ", ""],
            ["prefix:", source, ":suffix"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:", source, ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:", source, ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix: " + source + " :suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
        TOKEN_TYPE_WHITESPACE,
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
        TOKEN_TYPE_WHITESPACE,
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
        " ",
        "",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
        " ",
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForStringLiteral(source)
{
  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(source);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: (
            source === ""
              ? [
                  FRAGMENT_TYPE_TEMPLATE_FEED,
                ]
              : [
                  FRAGMENT_TYPE_TEMPLATE_STRING,
                  FRAGMENT_TYPE_TEMPLATE_FEED,
                ]
          ),
          raw: [[source], []],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(source),
        },
        expected: {
          values: (
            source.match(WHITESPACE_REGEXP) != null
              ? []
              : (
                  source === ""
                    ? []
                    : [source]
                )
          ),
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(source),
        },
        expected: {
          values: (
            source.match(WHITESPACE_REGEXP) != null
              ? (
                  source === LINE_FEED
                    ? [OPERATOR_EMIT, OPERATOR_EMIT]
                    : [OPERATOR_EMIT]
                )
              : (
                  source === ""
                    ? [OPERATOR_EMIT]
                    : [source, OPERATOR_EMIT]
                )
          ),
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(source),
        },
        expected: {
          className: source.trim(),
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = (
        source === ""
          ? []
          : Array.from(source).map(
              (character) =>
              {
                if (character === LINE_FEED)
                {
                  return TOKEN_TYPE_LINE_FEED;
                }
                else if (character.match(WHITESPACE_REGEXP) != null)
                {
                  return TOKEN_TYPE_WHITESPACE;
                }
                return TOKEN_TYPE_CHARACTER;
              },
            ).concat([
              TOKEN_TYPE_EOF,
            ])
      );

      return {
        actual: {
          tokens: collectTokens(source),
        },
        expected: {
          tokenTypes,
          tokenValues: (
            source === ""
              ? []
              : Array.from(source).concat([""])
          ),
        },
      };
    },
    source,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForSurroundedInterpolation(source)
{
  const quote = source.includes("\"") ? "'" : "\"";
  const finalSource = "prefix:" + "${" + quote + source + quote + "}" + ":suffix";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            ["prefix:", ":suffix"],
            [source],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: ["prefix:" + source + ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: "prefix:" + source + ":suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from("prefix:").map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(source).map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from("prefix:").concat([
        "",
      ]).concat(
        Array.from(source),
      ).concat([
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForTrailingInterpolation(source)
{
  const finalSource = source + "${\":suffix\"}";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            [source, ""],
            [":suffix"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: [source + ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: [source + ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: source + ":suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from(source).map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from(source).concat([
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @param {string} source
 * @returns {SnapshotData}
 */
function createSnapshotDataForTrailingInterpolationSeparatedByWhitespace(source)
{
  const finalSource = source + " " + "${\":suffix\"}";

  return {
    getConsolidationSegment: () =>
    {
      const rawFragments = compileTaggedTemplate(finalSource);
      return {
        actual: {
          fragments: collectConsolidatedFragments(rawFragments),
          raw: rawFragments,
        },
        expected: {
          fragmentTypes: [
            FRAGMENT_TYPE_TEMPLATE_STRING,
            FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
            FRAGMENT_TYPE_TEMPLATE_FEED,
          ],
          raw: [
            [source + " ", ""],
            [":suffix"],
          ],
        },
      };
    },
    getInterpretationSegment: () =>
    {
      return {
        actual: {
          values: collectInterpretedValues(finalSource),
        },
        expected: {
          values: [source, ":suffix"],
        },
      };
    },
    getParsingSegment: () =>
    {
      return {
        actual: {
          values: collectParsedValues(finalSource),
        },
        expected: {
          values: [source, ":suffix", OPERATOR_EMIT],
        },
      };
    },
    getRenderingSegment: () =>
    {
      return {
        actual: {
          className: getRenderedClassName(finalSource),
        },
        expected: {
          className: source + " :suffix",
        },
      };
    },
    getTokenizationSegment: () =>
    {
      const tokenTypes = Array.from(source).map(
        () => TOKEN_TYPE_CHARACTER,
      ).concat([
        TOKEN_TYPE_WHITESPACE,
        TOKEN_TYPE_EOF,
      ]).concat(
        Array.from(":suffix").map(
          () => TOKEN_TYPE_CHARACTER,
        ),
      ).concat([
        TOKEN_TYPE_EOF,
      ]);

      const tokenValues = Array.from(source).concat([
        " ",
        "",
      ]).concat(
        Array.from(":suffix"),
      ).concat([
        "",
      ]);

      return {
        actual: {
          tokens: collectTokens(finalSource),
        },
        expected: {
          tokenTypes,
          tokenValues,
        },
      };
    },
    source: finalSource,
  };
}

/**
 * @returns {Record<string, SnapshotData>}
 */
function createSnapshotDatasetForTailwindCSSClassNamesWithTrailingImplicitConditional()
{
  /**
   * @type {Record<string, SnapshotData>}
   */
  const snapshots = {};

  for (const className of Object.keys(DATASET_TAILWINDCSS_CLASS_NAMES))
  {
    for (
      const [
        implicitConditionalSource,
        implicitConditionalBooleanValue,
      ] of Object.entries(DATASET_IMPLICIT_CONDITIONALS)
    )
    {
      const finalSource = className + "${" + implicitConditionalSource + "}";

      const implicitConditionalValue = compileExpression(implicitConditionalSource);

      snapshots[finalSource] = {
        getConsolidationSegment: () =>
        {
          const rawFragments = compileTaggedTemplate(finalSource);
          return {
            actual: {
              fragments: collectConsolidatedFragments(rawFragments),
              raw: rawFragments,
            },
            expected: {
              fragmentTypes: [
                FRAGMENT_TYPE_TEMPLATE_STRING,
                FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
                FRAGMENT_TYPE_TEMPLATE_FEED,
              ],
              raw: [
                [className, ""],
                [implicitConditionalValue],
              ],
            },
          };
        },
        getInterpretationSegment: () =>
        {
          return {
            actual: {
              values: collectInterpretedValues(finalSource),
            },
            expected: {
              values: (
                implicitConditionalBooleanValue
                  ? [className]
                  : []
              ),
            },
          };
        },
        getParsingSegment: () =>
        {
          return {
            actual: {
              values: collectParsedValues(finalSource),
            },
            expected: {
              values: [
                className,
                implicitConditionalValue,
                OPERATOR_TEST,
                OPERATOR_EMIT,
              ],
            },
          };
        },
        getRenderingSegment: () =>
        {
          return {
            actual: {
              className: getRenderedClassName(finalSource),
            },
            expected: {
              className: (
                implicitConditionalBooleanValue
                  ? className
                  : ""
              ),
            },
          };
        },
        getTokenizationSegment: () =>
        {
          const tokenTypes = Array.from(className).map(
            () => TOKEN_TYPE_CHARACTER,
          ).concat([
            TOKEN_TYPE_EOF,
          ]);

          const tokenValues = Array.from(className).concat([
            "",
          ]);

          return {
            actual: {
              tokens: collectTokens(finalSource),
            },
            expected: {
              tokenTypes,
              tokenValues,
            },
          };
        },
        source: finalSource,
      };
    }
  }

  return snapshots;
}

/**
 * @returns {Record<string, SnapshotData>}
 */
function createSnapshotDatasetForTailwindCSSClassNamesWithTrailingImplicitConditionalSeparatedByWhitespace()
{
  /**
   * @type {Record<string, SnapshotData>}
   */
  const snapshots = {};

  for (const className of Object.keys(DATASET_TAILWINDCSS_CLASS_NAMES))
  {
    for (
      const [
        implicitConditionalSource,
        implicitConditionalBooleanValue,
      ] of Object.entries(DATASET_IMPLICIT_CONDITIONALS)
    )
    {
      const finalSource = className + " " + "${" + implicitConditionalSource + "}";

      const implicitConditionalValue = compileExpression(implicitConditionalSource);

      snapshots[finalSource] = {
        getConsolidationSegment: () =>
        {
          const rawFragments = compileTaggedTemplate(finalSource);
          return {
            actual: {
              fragments: collectConsolidatedFragments(rawFragments),
              raw: rawFragments,
            },
            expected: {
              fragmentTypes: [
                FRAGMENT_TYPE_TEMPLATE_STRING,
                FRAGMENT_TYPE_TEMPLATE_EXPRESSION,
                FRAGMENT_TYPE_TEMPLATE_FEED,
              ],
              raw: [
                [className + " ", ""],
                [implicitConditionalValue],
              ],
            },
          };
        },
        getInterpretationSegment: () =>
        {
          return {
            actual: {
              values: collectInterpretedValues(finalSource),
            },
            expected: {
              values: (
                implicitConditionalBooleanValue
                  ? [className]
                  : []
              ),
            },
          };
        },
        getParsingSegment: () =>
        {
          return {
            actual: {
              values: collectParsedValues(finalSource),
            },
            expected: {
              values: [
                className,
                implicitConditionalValue,
                OPERATOR_TEST,
                OPERATOR_EMIT,
              ],
            },
          };
        },
        getRenderingSegment: () =>
        {
          return {
            actual: {
              className: getRenderedClassName(finalSource),
            },
            expected: {
              className: (
                implicitConditionalBooleanValue
                  ? className
                  : ""
              ),
            },
          };
        },
        getTokenizationSegment: () =>
        {
          const tokenTypes = Array.from(className).map(
            () => TOKEN_TYPE_CHARACTER,
          ).concat([
            TOKEN_TYPE_WHITESPACE,
            TOKEN_TYPE_EOF,
          ]);

          const tokenValues = Array.from(className).concat([
            " ",
            "",
          ]);

          return {
            actual: {
              tokens: collectTokens(finalSource),
            },
            expected: {
              tokenTypes,
              tokenValues,
            },
          };
        },
        source: finalSource,
      };
    }
  }

  return snapshots;
}

/**
 * @constant
 * @type {Record<string, SnapshotData>}
 */
export const SNAPSHOT_MIXED = {
  "": createSnapshotDataForStringLiteral(""),

  ...Object.keys(
    DATASET_WHITESPACES,
  ).reduce(
    createReducer(
      createSnapshotDataForStringLiteral,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_PUNCTUATION,
  ).reduce(
    createReducer(
      createSnapshotDataForStringLiteral,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_DIGITS,
  ).reduce(
    createReducer(
      createSnapshotDataForStringLiteral,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForStringLiteral,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForLeadingInterpolation,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForTrailingInterpolation,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForDualEdgeInterpolation,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForSurroundedInterpolation,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForSequentialInterpolations,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForSequentialInterpolationsSeparatedByWhitespaces,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForLeadingInterpolationSeparatedByWhitespaces,
    ),
    {},
  ),

  ...Object.keys(
    DATASET_TAILWINDCSS_CLASS_NAMES,
  ).reduce(
    createReducer(
      createSnapshotDataForTrailingInterpolationSeparatedByWhitespace,
    ),
    {},
  ),

  ...createSnapshotDatasetForTailwindCSSClassNamesWithTrailingImplicitConditional(),

  ...createSnapshotDatasetForTailwindCSSClassNamesWithTrailingImplicitConditionalSeparatedByWhitespace(),
};
