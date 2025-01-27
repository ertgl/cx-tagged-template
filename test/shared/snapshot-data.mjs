/**
 * @import {
 *   type ClassName,
 *   type Fragment,
 *   type TemplateExpression,
 *   type TemplateString,
 *   type Token,
 *   type Value,
 * } from "../../src/index.js";
 */

/**
 * @typedef {object} SnapshotData
 * @property {string} source
 * @property {() => SnapshotDataConsolidationSegment} getConsolidationSegment
 * @property {() => SnapshotDataTokenizationSegment} getTokenizationSegment
 * @property {() => SnapshotDataParsingSegment} getParsingSegment
 * @property {() => SnapshotDataInterpretationSegment} getInterpretationSegment
 * @property {() => SnapshotDataRenderingSegment} getRenderingSegment
 */

/**
 * @typedef {object} SnapshotDataConsolidationSegment
 * @property {SnapshotDataConsolidationSegmentActualValues} actual
 * @property {SnapshotDataConsolidationSegmentExpectedValues} expected
 */

/**
 * @typedef {object} SnapshotDataConsolidationSegmentActualValues
 * @property {Fragment[]} fragments
 * @property {readonly [readonly TemplateString[], readonly TemplateExpression[]]} raw
 */

/**
 * @typedef {object} SnapshotDataConsolidationSegmentExpectedValues
 * @property {string[]} fragmentTypes
 * @property {readonly [readonly TemplateString[], readonly TemplateExpression[]]} raw
 */

/**
 * @typedef {object} SnapshotDataTokenizationSegment
 * @property {SnapshotDataTokenizationSegmentActualValues} actual
 * @property {SnapshotDataTokenizationSegmentExpectedValues} expected
 */

/**
 * @typedef {object} SnapshotDataTokenizationSegmentActualValues
 * @property {Token[]} tokens
 */

/**
 * @typedef {object} SnapshotDataTokenizationSegmentExpectedValues
 * @property {string[]} tokenTypes
 * @property {string[]} tokenValues
 */

/**
 * @typedef {object} SnapshotDataParsingSegment
 * @property {SnapshotDataParsingSegmentActualValues} actual
 * @property {SnapshotDataParsingSegmentExpectedValues} expected
 */

/**
 * @typedef {object} SnapshotDataParsingSegmentActualValues
 * @property {Value[]} values
 */

/**
 * @typedef {object} SnapshotDataParsingSegmentExpectedValues
 * @property {Value[]} values
 */

/**
 * @typedef {object} SnapshotDataInterpretationSegment
 * @property {SnapshotDataInterpretationSegmentActualValues} actual
 * @property {SnapshotDataInterpretationSegmentExpectedValues} expected
 */

/**
 * @typedef {object} SnapshotDataInterpretationSegmentActualValues
 * @property {Value[]} values
 */

/**
 * @typedef {object} SnapshotDataInterpretationSegmentExpectedValues
 * @property {Value[]} values
 */

/**
 * @typedef {object} SnapshotDataRenderingSegment
 * @property {SnapshotDataRenderingSegmentActualValues} actual
 * @property {SnapshotDataRenderingSegmentExpectedValues} expected
 */

/**
 * @typedef {object} SnapshotDataRenderingSegmentActualValues
 * @property {ClassName} className
 */

/**
 * @typedef {object} SnapshotDataRenderingSegmentExpectedValues
 * @property {ClassName} className
 */
