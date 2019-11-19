/**
 *
 */
export interface Composable {
  compose(mainFile: string, files: { [index: string]: string[] }): string;
  getRegex(): RegExp[];
}
/**
 * Base class for all Language Packages
 */
export abstract class Language implements Composable {
  protected beginGuard = '>>>BEGIN<<<';
  protected endGuard = '>>>END<<<';
  protected comment = '//';
  protected name: string;
  protected exts: string[];

  /**
   * @param name  language name, lowercase
   * @param exts  list of valid extensions, with preceding dot.
   * @returns Language Package
   */
  constructor(name: string, exts: string[]) {
    this.name = name;
    this.exts = exts;
  }
  /**
   * Name of language from language package
   * @returns name of language in lowercase
   */
  getName(): string {
    return this.name;
  }

  /**
   * Name of language from language package
   * @returns name of language in lowercase
   */
  processLine(line: string): string {
    return line;
  }

  /**
   * Verfies if extension is valid based on Language Package. Returns True if extension is valid, else False
   */
  isValidExt(ext: string): boolean {
    return this.exts.includes(ext);
  }

  /**
   * Prints list of valid extensions from language.
   * @returns Array of valid extensions with 1st element as base file extension
   */
  getExtensions(): string[] {
    return this.exts;
  }
  /**
   * Returns comment string for pre-pending with gaurds.
   * @returns Comment string to denote begining of gaurd.
   */
  getBeginGuard(): string {
    return this.beginGuard;
  }
  /**
   * Returns comment string for post-pending with gaurds.
   * @returns Comment string to denote end of gaurd.
   */
  getEndGuard(): string {
    return this.endGuard;
  }
  /**
   * Returns comment string for language to comment within the program.
   * @returns Comment string.
   */
  getCommentLiteral(): string {
    return this.comment;
  }
  /**
   * Creates flattened file in string format which composes all source files into a single file with runnable code.
   * @param mainFile Filename with entry point from source files.
   * @param files List of Filenames from source files.
   * @returns Flattened file with runnable functions from source files
   */

  abstract compose(
    mainfile: string,
    files: { [index: string]: string[] }
  ): string;
  abstract getRegex(): RegExp[];
}
