import type { Token } from "./token";

export type TokenEmitter = (
  token: Token,
) => void;
