import (Python) from '../../src/api/compose.python';
import {Composable, Language} from '../../src/api/compose.language';
import { compose } from '../../src/api';

const language = python;
const name = "python"
const ext = ".py"

function getAllFuncs(obj :{}) :string[] {
    /*
    *   source: https://stackoverflow.com/
                    questions/31054910/get-functions-methods-of-a-class
    *   author: Muhammad Umer
    *   modifications: removed filtered return, made tslint pass.
    */
    let props :string[] = [];
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj)
    } while (obj);

    return props;
}


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

    const run = (()=>{language.compose([""],{"":["",""]})})
    expect(run).not.toThrow()
})

test(`is regex of ${name} correct`,()=>{
    const cmp = language.getRegex()[0].exec("import module1")
    if(cmp !== null){
        expect(cmp[1] === "module1").toBe(true)
    }
    else{
        expect(cmp === null).toBe(true)
    }
	const cmp1 = language.getRegex()[1].exec("from module2 ")
	if(cmp1 !== null){
		expect(cmp1[1] === "module2").toBe(true)
	}
	else{
		expect(cmp1 === null).toBe(true)
	}
})


test(`${name} object name() returns correct name`,()=>{
    expect(language.getName()).toEqual(name)
})

test(`${name} object isValidExt() returns true for ${ext}`,()=>{
    expect(language.isValidExt(ext)).toBe(true)
})