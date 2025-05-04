// type JSON =
//   | string
//   | number
//   | boolean
//   | null
//   | undefined
//   | JSON[]
//   | { [key: string]: JSON };

/**
 * The serializable equivalence of a type.
 * @see https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */
export type Serialized<T> = T extends string | number | boolean | null
  ? T
  : T extends bigint
  ? string
  : T extends { toJSON(): infer U }
  ? U
  : T extends ArrayLike<infer U>
  ? Serialized<U>[]
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : never;

/**
 * Produce the serializable equivalence of a value.
 * @see https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */
export function serialize<T>(value: T): Serialized<T> {
  return JSON.parse(JSON.stringify(value));
}
