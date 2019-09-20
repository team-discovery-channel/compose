import {findModule} from '../../src/api/index';
import {javascript} from '../../src/api/compose.javascript'

var extensions = javascript.getExtensions();

test("Expected 'help.js' to return !false", () =>
{
  expect(findModule('help.js', extensions)).not.toBeFalsy();
});

test("Expected 'help' to return !false", ()=>
{
  expect(findModule('help', extensions)).not.toBeFalsy();
});

test("Expected 'help.ts' to return false", ()=>
{
	expect(findModule('help.ts', extensions)).toBeFalsy();
});

test("Expected 'help/index.js' to return !false", ()=>
{
	expect(findModule("help/index.js", extensions)).toBeFalsy();
});
