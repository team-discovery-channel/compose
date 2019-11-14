import { Language } from './language';
import { languageFactory } from './languages';
import mock from 'mock-fs';
import AdmZip from 'adm-zip';
import { EOL } from 'os';

export interface Directory {
  [index: string]: any;
}

/**
 * builds a directory object for mock-fs
 * @param paths any path string starting from root and split into array
 * @param dirs Directory object with root directory as only key
 * @returns the last subdir as Directory object from the paths parameter
 */
export const constructDirectoryObject = (
  paths: string[],
  dirs: Directory,
  root: Directory
): Directory => {
  const nextDir = paths.pop();

  if (nextDir === undefined) {
    return root;
  }

  if (nextDir === '') {
    return constructDirectoryObject(paths, dirs['/'], root); //for valid subdirs, this is return of root...
  }
  if (paths.length === 0) {
    if (nextDir in dirs) {
      return dirs[nextDir]; //case - sub dir file
    }
    dirs[nextDir] = {};
    return dirs[nextDir]; //case - sub dir file, sub dir didnt exist
  } else {
    if (nextDir in dirs) {
      return constructDirectoryObject(paths, dirs[nextDir], root); //subdir
    }
    dirs[nextDir] = {};
    return constructDirectoryObject(paths, dirs[nextDir], root); //subdir didnt exist
  }
};

/**
 * Reverts a file into its corresponding file tree
 * @param lines composed file as lines in a string array
 * @param langauge the langauge of the composed file
 * @returns a buffer representing the zip of the file tree
 */
export const revert = (file: Buffer, language: string): Buffer => {
  const languageInstance: Language = languageFactory(language);

  const comment = languageInstance.getCommentLiteral();
  const BEGIN = comment + languageInstance.getBeginGuard();
  const END = comment + languageInstance.getEndGuard();

  const lines: string[] = file
    .toString()
    .split('\r')
    .join('')
    .split('\n');

  const stack: number[] = new Array<number>();

  const mockdir: Directory = {};
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
      const end: number = stack.pop() as number;
      const begin: number = stack.pop() as number;
      dir = '/' + dir;

      const dirObj = constructDirectoryObject(
        dir
          .split('/')
          .slice(0, -1)
          .reverse(),
        mockdir,
        mockdir['/']
      );
      dirObj[dir.split('/').slice(-1)[0]] = lines.slice(begin, end).join(EOL);
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
