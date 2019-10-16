/**
 * Utility meathods for use with compose.
 * Should be language independant
 */
import { Language } from './compose.language';

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
          m[2],
          curlang.getExtensions(),
          Object.keys(files)
        );
        if (typeof requireName !== 'boolean') {
          neededFiles = filterFiles(files, curlang, requireName, regex).concat(
            neededFiles
          );
        }
        if (curlang.getName() === 'python' && /^\s*from/.test(line)) {
          const allnames = /from\s+\S+\s+import (.*)\1$/.exec(line);
          if (allnames !== null) {
            const names = allnames[2].split(',');
            for (const name of names) {
              const modname = requireName + '/' + name.trim();
              const needed = findModule(
                modname,
                curlang.getExtensions(),
                Object.keys(files)
              );
              if (typeof needed !== 'boolean') {
                neededFiles = filterFiles(files, curlang, needed, regex).concat(
                  neededFiles
                );
              }
            }
          }
        }
      }
    }
  }
  return [...new Set(neededFiles)];
};
