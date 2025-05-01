/**
 * Draw a random element from a list.
 */
function draw<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export const random = { draw };
