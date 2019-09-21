import {findModule} from '../../src/api/compose.utils';
import {javascript} from '../../src/api/compose.javascript'

const extensions = javascript.getExtensions();
const filelist = ["help.js", "alive/index.js"]

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
  expect(findModule("alive", extensions, filelist)).not.toBeFalsy();
});
