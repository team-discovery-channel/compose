/**
 * Utility meathods for use with compose.
 * Should be language independant
 */
import {Language} from './compose.language';


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

/**
 * Recursively filters a project file list down to those that are dependancies of the main file
 * @param files Files in the project
 * @param curlang User selected language
 * @param entryPoint User defined main file
 * @param regex Regular Expressions to identify import statements
 * @returns Returns an array of needed filenames
 */
export const filterFiles = (
	files: {[index: string]: string[]},
	curlang : Language,
	entryPoint : string,
	regex : string[]
): string[] => {
	var neededFiles: string[] = [entryPoint]
	for(const re in regex){
		
	}
	return neededFiles
};

