/* Based on code from https://github.com/jasonrute/modulize
 * */
import {python} from '../../src/api/python';
import {Composable, Language} from '../../src/api/language';
import * as utils from '../../src/api/python.utils';
import {example, desiredOutput} from "./pytest"

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

test(`${name} process lines returns a string with 4 less leading spaces`, ()=>{
    expect(language.processLine("    test")).toEqual("test")
})

test(`is ${name} composable`,()=>{

    const isComposable = ()=>{
        const isA:Composable = language;
    }
    expect(isComposable).not.toThrow();

})
test('test 1 for get_modules_from_import, import x format', ()=>{
	const im0 = "import foo"
	expect(utils.getModulesFromImport(im0)[0]).toEqual("foo")
})

test('test 2 for get_modules_from_import, from x format', ()=>{
	const im1 = "from foo import bar"
	expect(utils.getModulesFromImport(im1)[0]).toEqual("foo")
})

test('test 3 for get_modules_from_import, import x.y format', ()=>{
	const im2 = "import foo.bar"
	expect(utils.getModulesFromImport(im2)[0]).toEqual("foo.bar")
})

test("test for parseImportsStructure", ()=>{
	const expected = {'foo/__init__.py': [], 'foo/bar.py':[] , '__main__.py': ['foo', 'foo.bar']}
	const parsed = utils.parseImportStructure(example, "__main__.py", "")
	expect(parsed).toEqual(expected)
})

test("test for fileToModule", ()=>{
	const file1 = utils.fileToModule("__main__.py", "__main__.py", "")
	const file2 = utils.fileToModule("foo/bar.py", "__main__.py", "")
	const file3 = utils.fileToModule("foo/__init__.py", "__main__.py", "")
	expect(file1).toEqual(["main", "__main__"])
	expect(file2).toEqual(["module", "foo.bar"])
	expect(file3).toEqual(["package", "foo"])
})

test("test for block, main file", ()=>{
	const expected = `\n
def __main__():
    #Begin __main__.py
    import foo.bar
    import os
    fb = foo.bar.bar_func(foo.foo_var)
    print(fb) # foo bar
    #End __main__.py
__main__()
`
	const filename = "__main__.py"
	const filetext = example[filename].join("\n")
	const mod = utils.fileToModule(filename, filename, "")
	const deps = utils.parseImportStructure(example, filename, "")
	const block = utils.block(filename, mod, filetext, deps[filename])
	expect(block).toEqual(expected)
})

test("test for block, block file", ()=>{
	const expected = `
@modulize('foo.bar')
def _bar(__name__):
    #Begin foo/bar.py
    def bar_func(x):
        return x + ' bar2'
    #End foo/bar.py
    return locals()
`
	const filename = "foo/bar.py"
	const filetext = example[filename].join("\n")
	const mod = utils.fileToModule(filename, "__main__.py", "")
	const deps = utils.parseImportStructure(example, filename, "")
	const block = utils.block(filename, mod, filetext, deps[filename])
	expect(block).toEqual(expected)
})

test("test for block, block file with dependancies", ()=>{
	const expected = `
@modulize('foo.bar', dependencies= ("foo"))
def _bar(__name__):
    #Begin foo/bar.py
    def bar_func(x):
        return x + ' bar2'
    #End foo/bar.py
    return locals()
`
	const filename = "foo/bar.py"
	const filetext = example[filename].join("\n")
	const mod = utils.fileToModule(filename, "__main__.py", "")
	const deps = ['foo']
	const block = utils.block(filename, mod, filetext, deps)
	expect(block).toEqual(expected)
})
test('test for python combined', ()=>{
  expect(python.compose("__main__.py", example)).toEqual(desiredOutput)
})

test('test for python combined with base dir', ()=>{
    try{
    expect(python.compose("my_dir/__main__.py", example))
    }
    catch(e){}
})

test(`${name} object name() returns correct name`,()=>{
    expect(language.getName()).toEqual(name)
})

test(`${name} object isValidExt() returns true for ${ext}`,()=>{
    expect(language.isValidExt(ext)).toBe(true)
})
