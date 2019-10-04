/**
 * Utility meathods for use with compose.
 * Should be language independant
 */
import AdmZip from 'adm-zip';
import mock from 'mock-fs';
import { EOL } from 'os';
import { Language } from './compose.language';
import { javascript } from './compose.javascript';

export const languages: { [index: string]: Language[] } = {
  list: [javascript],
};

const languageFactory = (name: string): Language => {
  const lang: Language[] = languages.list.filter(
    (lang: Language) => lang.getName() === name
  );
  if (lang.length === 0) {
    throw new RangeError(
      `languageFactory in routes/index.ts has no instance for ${name}`
    );
  }
  return lang[0];
};

export const compose = (
  language: string,
  file: Buffer,
  entry: string,
  out: { [index: string]: string }
): Buffer => {
  const languageInstance: Language = languageFactory(language);
  out.filename = out.filename + languageInstance.getExtensions()[0];

  const zip = new AdmZip(file);
  const files = zip
    .getEntries()
    .filter(entry => !entry.isDirectory)
    .reduce<{ [index: string]: string[] }>((acc, entry) => {
      acc[
        entry.entryName
          .split('/')
          .slice(1)
          .join('/')
      ] = entry

        .getData()
        .toString('utf-8')
        .split('\n');
      return acc;
    }, {});

  const filenames: string[] = filterFiles(
    files,
    languageInstance,
    entry,
    languageInstance.getRegex()
  );

  const combinedFile: string = languageInstance.compose(
    filenames,
    files
  );
  return Buffer.from(combinedFile);
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

/*
 * Directory object for mock-fs
 * {
 *     "/":{
 *         "file_name.ext":"file as string",
 *         "file_name.ext":"second root dir file"
 *          "subdir_name": {
 *              "file_name.ext":"another file as string"
 *               .
 *               .
 *               .
 *           },
 *           .
 *           .
 *           .
 *      }
 * }
 */
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
export const revert = (lines: string[], language: Language): Buffer => {
  const comment = language.getCommentLiteral();
  const BEGIN = comment + language.getBeginGuard();
  const END = comment + language.getEndGuard();

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
