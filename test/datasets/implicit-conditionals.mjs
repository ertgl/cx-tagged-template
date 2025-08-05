/**
 * @constant
 */
export const DATASET_IMPLICIT_CONDITIONALS = {
  "0": Boolean(0),
  "1": Boolean(1),
  "2": Boolean(2),
  "(() => {})": Boolean(() => {}),
  "+Infinity": Boolean(Infinity),
  "-Infinity": Boolean(-Infinity),
  "[1]": Boolean([1]),
  "[]": Boolean([]),
  "BigInt(0)": Boolean(BigInt(0)),
  "BigInt(1)": Boolean(BigInt(1)),
  "false": false,
  "Infinity": Boolean(Infinity),
  "NaN": Boolean(NaN),
  "null": Boolean(null),
  "Symbol()": Boolean(Symbol()),
  "true": true,
  "undefined": Boolean(undefined),
  "{key: \"value\"}": Boolean({ key: "value" }),
  "{}": Boolean({}),
};
