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
 * @param moduleName Module to find and verify
 * @param extensions Array of valid file extensions
 * @param filelist Array of known files
 * @returns Returns either a truthy value(the moduleName with its extension) or false
 */
export const findModule = (
  moduleName: string,
  extensions: string[],
  filelist: string[]
): string | boolean => {
  let exts: string[];
  if (/\.js$/.test(moduleName)) {
    exts = [''];
  } else {
    exts = extensions;
  }

  for (const ext of exts) {
    if (filelist.includes(moduleName + ext)) {
      return moduleName + ext;
    }
  }
  return false;
};
