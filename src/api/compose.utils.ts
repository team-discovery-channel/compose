/**
 * Utility meathods for use with compose.
 * Should be language independant
 */
import AdmZip from 'adm-zip';
import mock from 'mock-fs';
import { EOL } from 'os';
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
          // delete files[test];
          neededFiles = filterFiles(files, curlang, requireName, regex).concat(
            neededFiles
          );
        }
      }
    }
  }
  return [...new Set(neededFiles)];
};

interface Directory {
  [index: string]: any;
}

const constructDirectoryObject = (
  paths: string[],
  dirs: Directory
): Directory | undefined => {
  const nextDir = paths.pop();
  if (nextDir === undefined) {
    return dirs['/']; //case - root level file
  }
  if (nextDir === '') {
    return constructDirectoryObject(paths, dirs['/']); //for valid subdirs, this is return of root...
  }
  if (paths.length === 0) {
    if (nextDir && nextDir in dirs) {
      return dirs[nextDir]; //case - sub dir file
    } else {
      if (nextDir) {
        dirs[nextDir] = {};
        return dirs[nextDir]; //case - sub dir file, sub dir didnt exist
      }
    }
    return undefined;
  } else {
    if (nextDir && nextDir in dirs) {
      return constructDirectoryObject(paths, dirs); //subdir
    } else {
      if (nextDir) {
        dirs[nextDir] = {};
        return constructDirectoryObject(paths, dirs); //subdir didnt exist
      }
    }
  }
  return undefined; //should never get here
};

export const uncompose = (
  lines: string[],
  language: Language
): Buffer => {
  const comment = language.getCommentLiteral()
  const BEGIN = comment+language.getBeginGuard()
  const END = comment+language.getEndGuard()
  
  const stack: number[] = new Array<number>();

  const mockdir: { [index: string]: any } = {};
  mockdir['/'] = {};

  lines
    .filter((line: string, index: number) => {
      if (line.match(BEGIN)) {
        stack.push(index + 1);
        return true;
      }
      if (line.match(END)) {
        stack.push(index);
        return false;
      }
      return false;
    })
    .map((line: string) => {
      return line.split(BEGIN)[1].trim();
    })
    .reverse()
    .map((dir: string) => {
      const end: number | undefined = stack.pop();
      const begin: number | undefined = stack.pop();
      if (begin && end) {
        if (dir.indexOf('/') !== -1) {
          dir = '/' + dir;
        }
        const dirObj = constructDirectoryObject(
          dir
            .split('/')
            .slice(0, -1)
            .reverse(),
          mockdir
        );
        if (dirObj) {
          dirObj[dir.split('/').slice(-1)[0]] = lines
            .slice(begin, end)
            .join(EOL);
        }
      }
    });

  const dirs = {};
  Object.assign(dirs, mockdir);
  mock(dirs, { createCwd: false, createTmp: false });

  const fzip = new AdmZip();
  fzip.addLocalFolder('/');
  const zipBuffer: Buffer = fzip.toBuffer();

  mock.restore();
  return zipBuffer;
};
