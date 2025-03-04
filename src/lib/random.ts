/**
 * Draw a random element from a list.
 */
export function draw<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}
