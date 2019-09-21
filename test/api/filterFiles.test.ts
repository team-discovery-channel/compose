import {filterFiles} from '../../src/api/compose.utils'
import {javascript} from '../../src/api/compose.javascript'

const jsfiles: {[index: string]: string[]} ={
	file1 : ["require('file2')", "require('file3')"],
	file2 : ["require('file4')", "console.log('Im')"],
	"file3.js" : ["console.log('Alive')"],
	"file4/index.js" : ["console.log('Help')"]
};

const filenames : string[] = Object.keys(jsfiles);

test("Filter files did not return expected output for javascript", () =>
	{
		expect(filterFiles(jsfiles, javascript, "file1", [/require\((['"])([^'"]+)\1\)/], [])).toMatchObject([ 'file3.js', 'file4/index.js', 'file2', 'file1' ])
	}
)
