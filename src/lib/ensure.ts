/**
 * Ensure a non nullable value or throw.
 */
export function ensure<T>(value: T, message?: string): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(message ?? "Expected a non nullable value");
  }
  return value;
}
