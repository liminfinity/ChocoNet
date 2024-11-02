export type JoinStrings<T extends readonly string[], S extends string> = T extends readonly [
  infer F,
  ...infer R extends readonly string[],
]
  ? F extends string
    ? `${F}${S}${JoinStrings<R, S>}`
    : ''
  : '';
