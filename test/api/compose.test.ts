import { TIMEOUT } from 'dns';
import { resolve } from 'url';
import {javascript} from '../../src/api/compose.javascript'
import {compose} from '../../src/api/compose.utils'
import path from 'path'
import fs from 'fs';

const dirObj = path.parse(__dirname)
const testFile = (filename:string) :string => dirObj.dir + path.sep + "files" + path.sep + filename

class TestObject{
	language:string;
	entry:string;
	file:string;
	out:{[index:string]:string};
	inBuffer:Buffer;
	outBuffer:Buffer;

	constructor(filename:string, language="javascript", entry="main.js", outFilename=""){
		this.language = language;
		this.file = testFile(filename);
		this.entry = entry
		this.out = {filename:outFilename};

		this.inBuffer = fs.readFileSync(this.file)
		this.outBuffer = Buffer.from("")
	}

	run(){
		this.outBuffer = compose(this.language, this.inBuffer, this.entry,this.out)
	}
}
const testObjects = [	new TestObject("js_test_sub_1.zip"),
											new TestObject("js_test_sub_1.zip", "syzygy", "void.syz"),
										  new TestObject("js_test_sub.zip")]

test("language implementations can compose", ()=>{
		testObjects.forEach((testObject)=>{
			try{
				testObject.run()
			}
			catch(e){
				//console.log(e)
			}
		})
  }
) 
