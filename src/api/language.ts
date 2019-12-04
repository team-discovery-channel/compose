/**
 * Establishes composable interface.
 * All languages need to implement the compose function
 */
export interface Composable {
  compose(mainFile: string, files: { [index: string]: string[] }): string;
}
/**
 * Base class for the language specific implementations.
 * Should be extended by all languages meant to be supported by the app.
 * At a minimum, class variables comment, name, and exts will need to be overwritten,
 * as well as the compose funciton for each new language added.
 * comment - the 
 */
export abstract class Language implements Composable {
  protected beginGuard = '>>>BEGIN<<<';
  protected endGuard = '>>>END<<<';
  protected comment = '//';
  protected name: string;
  protected exts: string[];

  /**
   * Base constructor. Overwritting comment, beginGuard, and endGuard should also occur here.
   * @param name  language name, lowercase
   * @param exts  list of valid extensions for the language, with preceding dot i.e. .js, .init, etc.
   * @returns Language Package
   */
  constructor(name: string, exts: string[]) {
    this.name = name;
    this.exts = exts;
  }
  /**
   * Name of the language. Used by the app to list the program in the front end interface and to recognize the language.
   * @returns name of language in lowercase
   */
  getName(): string {
    return this.name;
  }

  /**
   * Called in revert to undo any processing done to the line during compose.
   * This function is called line by line and is meant to undo changes made to the whole
   * program such as whitespacing adjustments.
   * See python.ts for an example.
   *
   * @param line string, line of the program
   * @returns default returns the same line, sub classes can override
   */
  processLine(line: string): string {
    return line;
  }

  /**
   * Verfies if extension is defined in exts. Returns True if extension is defined, else False.
   * @param ext extension to evaluate
   * @returns Truth value of evaluation. Is ext defined (is in list of exts)?
   */
  isValidExt(ext: string): boolean {
    return this.exts.includes(ext);
  }

  /**
   * Returns list of valid extensions (exts) from language.
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
   * @param files dictionary of source files. Key is full filename and value is string array of file.
   * @returns String of single, runnable, file
   */
  abstract compose(
    mainfile: string,
    files: { [index: string]: string[] }
  ): string;
}
