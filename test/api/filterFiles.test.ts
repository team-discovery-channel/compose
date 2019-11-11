import {filterFiles} from '../../src/api/javascript.utils'
import {javascript} from '../../src/api/javascript'

const jsfiles1: {[index: string]: string[]} ={
	file1 : ["require('file2')", "require('file3')"],
	file2 : ["require('file4')", "console.log('Im')"],
	"file3.js" : ["console.log('Alive')"],
	"file4/index.js" : ["require('file6')", "console.log('Help')"]
};

const jsfilesout1 = [ 'file3.js', 'file4/index.js', 'file2', 'file1' ]


const jsregex = [/require\((['"])([^'"]+)\1\)/]

const jsfiles2: {[index: string]: string[]} ={
	file1 : ["require('file2')", "require('file3')"],
	file2 : ["require('file4')", "console.log('Im')"],
	"file3.js" : ["console.log('Alive')"],
	"file4/index.js" : ["require('file3')","require('file5')","console.log('Help')"],
	file5 : ["require('file3')", "console.log('Im')"],
};

const jsfilesout2 = [ 'file3.js', 'file5', 'file4/index.js', 'file2', 'file1' ]

test("Filter files did not return expected output for javascript1", () =>
	{
		expect(filterFiles(jsfiles1, javascript, "file1", jsregex)).toMatchObject(jsfilesout1)
	}
)

test("filterFiles did not return expected output for javascript2", () =>
	{
		expect(filterFiles(jsfiles2, javascript, "file1", jsregex)).toMatchObject(filterFiles(jsfiles2, javascript, "file1", jsregex))
	}
)
