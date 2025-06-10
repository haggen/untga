/**
 * Common curve functions.
 */
export const curves = {
  // Maintains constant speed throughout the progression.
  linear: (x: number) => x,
  // Starts slowly and accelerates towards the end.
  quadratic: (x: number) => x * x,
  // Starts very slowly and accelerates rapidly towards the end.
  cubic: (x: number) => x * x * x,
  // Starts quickly and gradually decelerates.
  decay: (x: number) => 1 - Math.pow(1 - x, 2),
  // Starts and ends slowly with acceleration in the middle.
  sigmoid: (x: number) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
} as const;

/**
 * Interpolate between min and max following a curve function.
 */
export function interpolate(
  min: number,
  max: number,
  ratio: number,
  curve: (x: number) => number = curves.linear
) {
  return min + (max - min) * curve(clamp(0, 1, ratio));
}

/**
 * Clamp a value between a minimum and maximum.
 */
export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}
