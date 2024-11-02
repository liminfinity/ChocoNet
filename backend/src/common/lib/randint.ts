/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A random integer between min and max.
 */
export const randint = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};
