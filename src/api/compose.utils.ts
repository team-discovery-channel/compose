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
      }
    }
  }
  return [...new Set(neededFiles)];
}
export const getModulesFromImport = (
    line : string
): string[] => {
    let imports : string[] = []
    line.trim()
    if (line.startsWith('from ')) {
        line = line.substr(5).trim()
        const tempStr = line.split(' import ') 
        const module = tempStr[0].trim()
        for (const name of tempStr[1].split(',')){
            imports = imports.concat(module + '.' + name.trim())
        }
    }
    else if (line.startsWith('import ')) {
        line = line.substr(7).trim()
        for (const module of line.split(',')) {
            imports = imports.concat(module.trim())
        }
    }
    return imports
}

export const filterPythonFiles = (
	files : {[index : string]: string[]},
	entryPoint: string,
): {[index : string] : string[]}=> {
	let neededFiles: string[] = [entryPoint];
	
	
	return {}
}
