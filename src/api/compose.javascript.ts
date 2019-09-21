import { Composable, Language } from './compose.language';

/**
 * composes javascript source files.
 */
class Javascript extends Language implements Composable {
  constructor() {
    super('javascript', ['.js', '/index.js', '']);
  }
  /**
   * @param config object of options for javascript language
   * @returns
   */
  compose(config: {}): string {
    return JSON.stringify({});
  }
}
export const javascript = new Javascript();
