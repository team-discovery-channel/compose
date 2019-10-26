import { getAbsolutePath } from "../../src/api/compose.utils";
import {javascript} from "../../src/api/compose.javascript"



test("getAbsolutePath returns relative path off base",()=>{
    expect(getAbsolutePath("/main/test.js","../stuff.js",javascript))
    expect(getAbsolutePath("/main/test.js","./stuff",javascript))
    expect(getAbsolutePath("/main/test.js","../sub/stuff",javascript))
    expect(getAbsolutePath("/main/test.js","/test",javascript))
})