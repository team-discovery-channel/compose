/**
 * Called by controllers
 * Bridge point between front end/API calls and
 * language specific logic
 */

import { languages } from './languages';
import { Language } from './language';
import { RESTError } from './error';
import AdmZip from 'adm-zip';

const errors = {
  notImplemented: (lang = 'undefined'): RESTError =>
    new RESTError(
      `${lang} is not implemented`,
      ` implemented languages are [ ${Object.keys(languages).join(', ')} ]`,
      '501'
    ),
  ZIPError: new RESTError('Zip utility failed to process zip', '', '400'),
  entryNotFound: (possible: string[], entry: string): RESTError => {
    if (possible.length === 0) {
      return new RESTError(
        `Entry file '${entry}' not found in zip`,
        'No suggestions',
        '404'
      );
    }
    return new RESTError(
      `Entry file '${entry}' not found in zip`,
      `Maybe ${possible.length > 1 ? 'one of ' : 'this '} '${possible.join(
        "', '"
      )}`,
      '404'
    );
  },
};

/**
 * Entry point for compose functionality
 * @param file Buffer of zip folder uploaded by user
 * @param language Selected Language
 * @param out object with a property filename set as string output filename
 * @param entry Filename of entry ("main") file
 * @return Buffer of combined file
 */
export const compose = (
  file: Buffer,
  language: string,
  out: { [index: string]: string },
  entry: string
): Buffer => {
  if (Object.getOwnPropertyNames(languages).indexOf(language) === -1) {
    throw new Error(JSON.stringify(errors.notImplemented(language)));
  }
  const languageInstance: Language = languages[language];
  out.filename = out.filename + languageInstance.getExtensions()[0];

  let zip: AdmZip;
  try {
    zip = new AdmZip(file);
  } catch (e) {
    throw new Error(JSON.stringify(errors.ZIPError));
  }

  const files = zip
    .getEntries()
    .filter(entry => !entry.isDirectory)
    .reduce<{ [index: string]: string[] }>((acc, entry) => {
      acc[entry.entryName] = entry
        .getData()
        .toString('utf-8')
        .split('\r')
        .join('')
        .split('\n');
      return acc;
    }, {});

  if (Object.keys(files).indexOf(entry) === -1) {
    const possible: string[] = Object.keys(files).filter(
      fn => fn.indexOf(entry) !== -1
    );

    throw new Error(JSON.stringify(errors.entryNotFound(possible, entry)));
  }

  const combinedFile: string = languageInstance.compose(
    entry,
    files
  );

  return Buffer.from(combinedFile);
};
