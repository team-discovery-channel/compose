/**
 * This is a doc comment for a file
 */

/**
 * @param files  Files to return as JSON.
 * @returns      Returns JSON with file names.
 */
export const compose = (files: { [index: string]: string[] }) => {
  return JSON.stringify(files);
};

