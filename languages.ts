import { Language } from './language';
import {python} from './python'
import {javascript} from './javascript'

export const languages: { [index: string]: Language } = {
  javascript,
  python,
};

export const languageFactory = (name: string): Language => {
  const lang: Language = languages[name];
  if (lang === undefined) {
    throw new RangeError(
      `languageFactory in routes/index.ts has no instance for ${name}`
    );
  }
  return lang;
};
