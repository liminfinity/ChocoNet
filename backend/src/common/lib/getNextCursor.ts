/**
 * Given an array of objects with an "id" property, returns the value of the
 * last object's "id" property. This is used to implement pagination cursors.
 *
 * If the array is empty, returns undefined.
 */
export const getNextCursor = <T extends { id: string }>(data: T[]): string | undefined => {
  return data.length > 0 ? data[data.length - 1]?.id : undefined;
}
