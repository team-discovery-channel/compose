import { languageFactory } from './languages';
import { Language } from './language';
import AdmZip from 'adm-zip';

export const compose = (
  file: Buffer,
  language: string,
  out: { [index: string]: string },
  entry: string
): Buffer => {
  const languageInstance: Language = languageFactory(language);
  out.filename = out.filename + languageInstance.getExtensions()[0];

  const zip = new AdmZip(file);
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

  const combinedFile: string = languageInstance.compose(
    entry,
    files
  );
  return Buffer.from(combinedFile);
};
