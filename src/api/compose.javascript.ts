import { Composable, Language } from './compose.language';
class Javascript extends Language implements Composable {
  constructor() {
    super('javascript', ['.js']);
  }
  compose(config: {}): string {
    return JSON.stringify({});
  }

  getName(): string {
    return this.name;
  }

  isValidExt(ext: string): boolean {
    return this.exts.includes(ext);
  }
}
export const javascript = new Javascript();
