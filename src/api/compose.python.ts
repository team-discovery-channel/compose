import { Composable, Language } from './compose.language';

/*
 * composes python source files
 */
class Python extends Language {
  constructor(){
     super('python', ['.py', '__init__.py', '']) 
  }
  getRegex(): RegExp[]{
    return []
  }
/**
  * @param filelist ordered list of files returned by filterFiles. Last index is the entrypoint
  * @param files the files from the zip
  * @returns composedFile the combined file of
  */
	compose(filelist: string[], files: { [index: string]: string[] }): string {
		return ""
   }
   
}

export const python = new Python();
