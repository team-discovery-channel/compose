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

/**
 * Ensures module extracted from code is valid and in the filelist
 * @param filename File to verify
 * @param extensions Array of valid file extensions
 * @param filelist Array of known files
 * @returns Returns either a truthy value(the filename with its extension) or false
 */
export const findModule = (
  filename: string,
  extensions: string[],
  filelist: string[]
): string | boolean => {
  let exts: string[];
  if (/\.js$/.test(filename)) {
    exts = [''];
  } else {
    exts = extensions;
  }

  for (const ext of exts) {
    if (filelist.includes(filename + ext)) {
      return filename + ext;
    }
  }
  return false;
};
