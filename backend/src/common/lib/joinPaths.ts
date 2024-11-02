import type { JoinStrings } from '../types';

const SEPARATOR = '/';

/**
 * Joins an array of string paths using a specified separator and returns the
 * resulting path as a single string.
 *
 * @param paths - An array of string paths to be joined.
 * @returns The joined path string.
 */
export const joinPaths = <T extends readonly string[]>(
  ...paths: T
): JoinStrings<T, typeof SEPARATOR> => paths.join(SEPARATOR) as JoinStrings<T, typeof SEPARATOR>;
