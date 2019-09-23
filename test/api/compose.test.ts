import {compose} from '../../src/api/index';
import { TIMEOUT } from 'dns';
import { resolve } from 'url';
import {javascript} from '../../src/api/compose.javascript'

test("Expected return from compose must be valid json", () => {

    const validJson = () => {
        compose({"hello_world.js":["Line 1", "Line 2","line 3","Line 4"]})
    };

    expect(validJson)
        .not
        .toThrow();
});

const jsfiles1: {[index: string]: string[]} ={
	file1 : ["require('file2')", "require('file3')"],
	file2 : ["require('file4')", "console.log('Im')"],
	"file3.js" : ["console.log('Alive')"],
	"file4/index.js" : ["require('file6')", "console.log('Help')"]
};

const jsfilenames1 = [ 'file3.js', 'file4/index.js', 'file2', 'file1' ]

test("first test for javascript compose", ()=>
  {
    console.log(javascript.compose(jsfilenames1, jsfiles1))
  }
) 
