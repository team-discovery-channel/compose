import {findModule} from '../../src/api/index';
import {javascript} from '../../src/api/compose.javascript'

var extensions = javascript.getExtensions();
var filelist = ["help.js", "alive/index.js"]

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
  expect(findModule("alive", extensions, filelist)).toBeFalsy();
});
