import {getModulesFromImport} from "../../src/api/compose.utils"
const im0 = "import foo"
const im1 = "from foo import bar"
test('test 1 for get_modules_from_import, import x format', ()=>{
	expect(getModulesFromImport(im0)[0]).toEqual("foo")
})

test('test 2 for get_modules_from_import, from x format', ()=>{
	expect(getModulesFromImport(im1)[0]).toEqual("foo")
})
