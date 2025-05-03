// type JSON =
//   | string
//   | number
//   | boolean
//   | null
//   | undefined
//   | JSON[]
//   | { [key: string]: JSON };

type Serialized<T> = T extends string | number | boolean | null
  ? T
  : T extends { toJSON(): infer U }
  ? U
  : T extends Array<infer U>
  ? Serialized<U>[]
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : never;

/**
 * Produce a JSON valid type of given value.
 */
export function serialize<T>(value: T): Serialized<T> {
  return JSON.parse(JSON.stringify(value));
}
