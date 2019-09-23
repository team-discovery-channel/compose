/**
 * Language is the parent class for all languages
 */
export class Language {
  protected name: string;
  protected exts: string[];

  /**
   * @param name  language name, lowercase
   * @param exts  list of valid extensions, with preceding dot.
   */
  constructor(name: string, exts: string[]) {
    this.name = name;
    this.exts = exts;
  }

  /**
   * getter method for language name
   * @returns
   */
  getName(): string {
    return this.name;
  }

  /**
   * checks if ext is a valid extension
   * @returns
   */
  isValidExt(ext: string): boolean {
    return this.exts.includes(ext);
  }

  /**
   * returns array of extensions. extension at index 0 is the base file extension (.js, .py, etc)
   * @returns
   */
  getExtensions(): string[] {
    return this.exts;
  }
}
export interface Composable {
  /**
   * @param config  object holds language specific options
   * @returns composed file as string
   */
  compose(config: {}): string;
}
