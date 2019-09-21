import {Composable, Language} from '../../src/api/compose.language';

const language = "abstract";
const exts = [".abs"];

const languageInstance = new Language(language, exts);

test(`language name should be ${language}`, ()=>{
    expect(languageInstance.getName()).toEqual(language)
})

test(`${exts[0]} is a valid extension`, ()=>{
    expect(languageInstance.isValidExt(exts[0])).toBe(true);
})

test(`.nope is not a valid extension`, ()=>{
    expect(languageInstance.isValidExt(".nope")).toBe(false);
})