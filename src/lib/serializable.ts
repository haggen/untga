type Scalar = string | number | boolean | null | undefined;

/**
 * The serializable version of a type.
 * @see https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */
export type Serializable<T> = T extends Scalar
  ? T
  : T extends bigint
  ? string
  : T extends { toJSON(): infer U }
  ? U
  : T extends ArrayLike<infer U>
  ? Serializable<U>[]
  : T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : never;

function reviver(key: string, value: unknown) {
  if (value === undefined) {
    return undefined;
  }
  return value;
}

function replacer(key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

/**
 * Produce the serializable version of a value.
 * @see https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */
export function serializable<T>(value: T): Serializable<T> {
  if (value === undefined) {
    throw new Error("Cannot serialize undefined value");
  }
  return JSON.parse(JSON.stringify(value, replacer), reviver);
}
