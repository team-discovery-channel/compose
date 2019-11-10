import {javascript} from '../../src/api/javascript';
import {Composable, Language} from '../../src/api/language';
import {findModule} from '../../src/api/javascript.utils';


const language = javascript;
const name = "javascript"
const ext = ".js"

test(`does the ${name} object have properties`, ()=>{
    const properties :string[] = Object.keys(language);
    expect(properties.length).not.toEqual(0);
})


test(`is ${name} a language`,()=>{
    expect(language).toBeInstanceOf(Language);
})


test(`is ${name} composable`,()=>{

    const isComposable = ()=>{
        const isA:Composable = language;
    }
    expect(isComposable).not.toThrow();

})


test(`is ${name}'s compose function returning JSON object`,()=>{

    const run = (()=>{language.compose("",{"":["",""]})})
    expect(run).not.toThrow()
})

test(`is regex of ${name} correct`,()=>{
    const cmp = language.getRegex()[0].exec("require(\"module1\")");
    if(cmp !== null){
        expect(cmp[2] === "module1").toBe(true);
    }
    else{
        expect(cmp === null).toBe(true);
    }
})

test(`${name} object name() returns correct name`,()=>{
    expect(language.getName()).toEqual(name)
})

test(`${name} object isValidExt() returns true for ${ext}`,()=>{
    expect(language.isValidExt(ext)).toBe(true)
})

const extensions = javascript.getExtensions();
const filelist = ["help.js", "alive/index.js"]

test("Expected 'help.js' to return !false", () =>
{
  expect(findModule('help.js', extensions, filelist)).not.toBeFalsy();
});

test("Expected 'help' to return !false", ()=>
{
  expect(findModule('help', extensions, filelist)).not.toBeFalsy();
});

test("Expected 'help.ts' to return false", ()=>
{
  expect(findModule('help.ts', extensions, filelist)).toBeFalsy();
});

test("Expected 'alive' to return !false", ()=>
{
  expect(findModule("alive", extensions, filelist)).not.toBeFalsy();
});
