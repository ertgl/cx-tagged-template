import {
  consolidate,
  type Consolidator,
} from "./consolidator";
import {
  createOperatorsMapping,
  type ExtendedOperatorsMapping,
  type OperatorsMapping,
} from "./cx-operators";
import {
  interpret,
  type Interpreter,
} from "./interpreter";
import {
  parse,
  type Parser,
} from "./parser";
import {
  render,
  type Renderer,
} from "./renderer";
import {
  tokenize,
  type Tokenizer,
} from "./tokenizer";
import type { Transformer } from "./transformer";

export type Options<
  T_CustomOperators extends OperatorsMapping = OperatorsMapping,
> = {
  consolidator?: Consolidator | null;
  interpreter?: Interpreter | null;
  operators?: null | T_CustomOperators;
  parser?: null | Parser;
  renderer?: null | Renderer;
  tokenizer?: null | Tokenizer;
  transformer?: null | Transformer;
};

export type ResolvedOptions<
  T_CustomOperators extends OperatorsMapping = OperatorsMapping,
> = {
  consolidator: Consolidator;
  interpreter: Interpreter;
  operators: ExtendedOperatorsMapping<T_CustomOperators>;
  parser: Parser;
  renderer: Renderer;
  tokenizer: Tokenizer;
  transformer: null | Transformer | undefined;
};

export function resolveOptions<
  T_CustomOperators extends OperatorsMapping = OperatorsMapping,
>(
  options?: null | Options<T_CustomOperators>,
): ResolvedOptions<T_CustomOperators>
{
  options ??= {};

  return {
    consolidator: options.consolidator ?? consolidate,
    interpreter: options.interpreter ?? interpret,
    operators: createOperatorsMapping<T_CustomOperators>(options.operators),
    parser: options.parser ?? parse,
    renderer: options.renderer ?? render,
    tokenizer: options.tokenizer ?? tokenize,
    transformer: options.transformer,
  };
}
