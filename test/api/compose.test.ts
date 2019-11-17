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
	outBuffer:Buffer;

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
}

const testObjects = [
			{description:"Compose should throw if file not found in zip", test:(new TestObject("simple", "javascript", "main.js")).thrown(), result:{toThrowError:"404"}},
			{description:"Compose should throw if language is not implemented", test:(new TestObject("simple", "_unlikely_language")).thrown(), result:{toThrowError:"501"}},
		]


describe("Compose testing", ()=>{
		testObjects.forEach((testObject)=>{
		test(testObject.description, ()=>{
			const toMatch = Object.keys(testObject.result)[0]
			const result = testObject.result[toMatch]

			expect(testObject.test)[toMatch](result)
		}
		) 
	})
})

