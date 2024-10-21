import type { JoinStrings } from '../types';

const SEPARATOR = '/';

export const joinPaths = <T extends readonly string[]>(
  ...paths: T
): JoinStrings<T, typeof SEPARATOR> => paths.join(SEPARATOR) as JoinStrings<T, typeof SEPARATOR>;
