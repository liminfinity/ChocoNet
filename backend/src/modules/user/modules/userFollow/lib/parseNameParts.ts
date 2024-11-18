/**
 * Parses a given name string into an array of name parts.
 *
 * The function trims whitespace, converts the string to lowercase,
 * splits it by spaces, and filters out any empty parts.
 *
 * @param name - The name string to be parsed.
 * @returns An array of non-empty, lowercase name parts.
 */
export const parseNameParts = (name: string): string[] => {
  return name.trim().toLowerCase().split(' ').filter(Boolean);
};
