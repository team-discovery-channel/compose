/**
 * Javascript Utility methods for use with Javascript Language Package.
 */
import { Language } from './language';

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
  const re = RegExp(extensions[0] + '$');
  if (re.test(moduleName)) {
    exts = [''];
  } else {
    exts = extensions;
  }

  for (const ext of exts) {
    if (
      filelist.filter(
        (filename: string) => filename.indexOf(moduleName + ext) !== -1
      )[0]
    ) {
      return filelist.filter(
        (filename: string) => filename.indexOf(moduleName + ext) !== -1
      )[0];
    }
  }
  return false;
};

/**
 * replaces relative paths with corresponding directories from root.
 * @param parent path of parent modules
 * @param subdir the required module with possible relative path
 * @param language used to get extension
 */
export const getAbsolutePath = (
  parent: string,
  subdir: string,
  language: Language
) => {
  const base = parent.split('/');
  const relative = subdir.split('/');
  const result: string[] = [];

  base.pop();

  while (relative.length !== 0) {
    const sub = relative.pop();
    if (sub === '.') {
      continue;
    }
    if (sub === '..') {
      base.pop();
    } else {
      result.push(sub as string);
    }
  }
  if (result[0].slice(-3) === '.js') {
    result[0] = result[0].slice(0, -3);
  }
  if (result[result.length - 1] !== base[0]) {
    while (base.length !== 0) {
      result.push(base.pop() as string);
    }
  }
  return result.reverse().join('/');
};

/**
 * Recursively filters a project file list down to those that are dependancies of the main file
 * @param files Files in the project
 * @param curlang User selected language
 * @param entryPoint User defined main file
 * @param regex Regular Expressions to identify import statements
 * @returns Returns an array of needed filenames
 */
export const filterFiles = (
  files: { [index: string]: string[] },
  curlang: Language,
  entryPoint: string,
  regex: RegExp[]
): string[] => {
  let neededFiles: string[] = [entryPoint];
  const curfile: string[] = files[entryPoint];
  for (const line of curfile) {
    for (const reg of regex) {
      const re = reg;
      const m = re.exec(line);

      if (m !== null) {
        const requireName = findModule(
          getAbsolutePath(entryPoint, m[2], curlang),
          curlang.getExtensions(),
          Object.keys(files)
        );
        if (typeof requireName !== 'boolean') {
          neededFiles = filterFiles(files, curlang, requireName, regex).concat(
            neededFiles
          );
        }
      }
    }
  }
  return [...new Set(neededFiles)];
};
