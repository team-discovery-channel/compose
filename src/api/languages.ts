/**
 * Defines existing languages for the entire program
 * Any language provided by the user needs to be included
 * in the languages dictionary
 *
 */

import { Language } from './language';
import { python } from './python';
import { javascript } from './javascript';

/**
 * Dictionary of languages regestered by the program.
 * New languages should be added here.
 * The 'key' for each languages should be the simplest name for each language, all lower case
 */
export const languages: { [index: string]: Language } = {
  javascript,
  python,
};

/**
 * Factory to select language with error checking for undefined languages
 *
 */
export const languageFactory = (name: string): Language => {
  const lang: Language = languages[name];
  if (lang === undefined) {
    throw new RangeError(
      `languageFactory in routes/index.ts has no instance for ${name}`
    );
  }
  return lang;
};
