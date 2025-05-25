/**
 * Throw if given value either null or undefined.
 */
export function ensure<T>(value: T, err?: Error | string): NonNullable<T> {
  if (value === undefined || value === null) {
    throw err instanceof Error
      ? err
      : new Error(err ?? "Expected a non nullable value");
  }
  return value;
}
