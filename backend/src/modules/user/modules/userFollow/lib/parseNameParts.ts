/**
 * Splits a given name into its constituent parts.
 *
 * @param name - The name to split.
 * @returns An array of strings, where each string is a part of the original name.
 *
 * @example
 * parseNameParts('John Doe'); // ['john', 'doe']
 * parseNameParts('  John   Doe  '); // ['john', 'doe']
 * parseNameParts(''); // []
 * parseNameParts('   '); // []
 */
export const parseNameParts = (name: string): string[] => {
  return name.trim().toLowerCase().split(/\s+/);
};
