// type Value = string | number | boolean | null | undefined;

// type Serializable<T> = T extends Value
//   ? T
//   : T extends Date
//   ? string
//   : T extends Array<infer U>
//   ? Array<Serializable<U>>
//   : T extends Record<string, infer U>
//   ? { [K in keyof T]: Serializable<U> }
//   : never;

export function serializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
