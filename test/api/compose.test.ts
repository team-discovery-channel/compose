import fs from 'fs';
import AdmZip from 'adm-zip'
import {compose} from '../../src/api/compose'
import { Z_NO_COMPRESSION } from 'zlib';


class TestObject{
	language:string;
	entry:string;
	folder:string;
	out:{[index:string]:string};
	inBuffer:Buffer;

	constructor(dir:string, language="javascript", entry="index.js", outFilename=""){
		this.language = language;
		this.folder = `./test/files/${language}/${dir}`;
		this.entry = entry
		this.out = {filename:outFilename};
		const zip = new AdmZip()
		zip.addLocalFolder(this.folder)
		this.inBuffer = zip.toBuffer()
	}

	thrown(){
		return ()=>{compose(this.inBuffer,this.language, this.out, this.entry)}
	}
	thrownLanguage(){
		return ()=>{compose(this.inBuffer,"_unlikley_language_name", this.out, this.entry)}
	}
	run(){
		return compose(this.inBuffer,this.language, this.out, this.entry).toString()
	}
}

const testObjects : any[] = [
			{description:"should throw if file not found in zip", test:(new TestObject("simple", "javascript", "main.js")).thrown(), result:{toThrow:"404"}},
			{description:"should throw if language is not implemented", test:(new TestObject("simple")).thrownLanguage(), result:{toThrow:"501"}},
			{description:"if it is able to compose simple files", test:(new TestObject("simple")).run(), result:{stringContaining:"'simple/subone.js': (function(module, exports, require)"}}
		]


describe("Compose testing", ()=>{
		testObjects.forEach((testObject)=>{
			test(testObject.description, ()=>{
				const toMatch:string = Object.keys(testObject.result)[0]
				const result:string = testObject.result[toMatch]
				const expectObj = expect(testObject.test)
				const expectfunc = Object.values(expectObj)[Object.keys(expectObj).indexOf(toMatch)]
				expectfunc.call(expect(testObject.test),result)
			}
			) 
	})
})

