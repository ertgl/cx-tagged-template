import type { ClassName } from "../../class-name";
import type { Transformer } from "../../transformer";

export type CSSModuleClassNamesMapping = {
  [key: string]: string;
};

export function createCSSModulesTransformer(
  styles: CSSModuleClassNamesMapping,
): Transformer
{
  return (
    className: ClassName,
  ): ClassName =>
  {
    return styles[className] ?? className;
  };
}
