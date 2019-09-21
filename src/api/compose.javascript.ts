import { Composable, Language } from './compose.language';

/**
 * composes javascript source files.
 */
class Javascript extends Language implements Composable {
  constructor() {
    super('javascript', ['.js', '', '/index.js']);
  }
  /**
   * @param config object of options for javascript language
   * @returns
   */
  compose(config: {}): string {
    return JSON.stringify({});
  }

  getName(): string {
    return this.name;
  }

  isValidExt(ext: string): boolean {
    return this.exts.includes(ext);
  }

  getExtensions(): string[] {
    return this.exts;
  }
}
export const javascript = new Javascript();
