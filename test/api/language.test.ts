import {Composable, Language} from '../../src/api/language';

const language = "abstract";
const exts = [".abs"];

class MockLang extends Language {
  constructor() {
    super('abstract', ['.abs', '/index.js', '']);
  }

  compose(filelist: string, files: { [index: string]: string[] }): string {
    return "";
  }
}



const languageInstance = new MockLang();

test(`language name should be ${language}`, ()=>{
    expect(languageInstance.getName()).toEqual(language)
})

test(`${exts[0]} is a valid extension`, ()=>{
    expect(languageInstance.isValidExt(exts[0])).toBe(true);
})

test(`.nope is not a valid extension`, ()=>{
    expect(languageInstance.isValidExt(".nope")).toBe(false);
})

test(`Langauge default process line`, ()=>{
  expect(languageInstance.processLine("test")).toEqual("test")
})
