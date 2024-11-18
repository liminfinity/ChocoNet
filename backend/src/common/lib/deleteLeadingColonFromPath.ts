/**
 * Removes the leading colon from a given path string, if it exists.
 *
 * @param path - The path string from which to remove the leading colon.
 * @returns The path string without the leading colon, if it was present.
 */
export const deleteLeadingColonFromPath = (path: string): string => {
  return path.startsWith(':') ? path.slice(1) : path;
};
