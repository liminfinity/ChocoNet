/**
 * Creates a unique key for Redis storage.
 *
 * @param namespace - The namespace for the key, used to group related keys.
 * @param identifiers - A list of identifiers that will be joined together to
 * create the key.
 * @returns The unique key.
 */
export const createRedisKey = (namespace: string, ...identifiers: (string | number)[]): string => {
  return `${namespace}:${identifiers.join(':')}`;
};
