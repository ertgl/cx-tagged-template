import type { ClassName } from "./class-name";

export type Transformer = (
  className: ClassName,
) => ClassName;
