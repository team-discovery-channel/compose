import { Composable, Language } from './compose.language';

/*
 * composes python source files
 */
class Python extends Language {
  constructor() {
    super('python', ['.py', '__init__.py', '']);
  }
  getRegex(): RegExp[] {

//    import\s+([A-Z,a-z]+)
    return [/import\s+([A-Z,a-z]+)/];
  }

  compose(filelist: string[], files: { [index: string]: string[] }): string {
    return '';
  }
}

export const python = new Python();
