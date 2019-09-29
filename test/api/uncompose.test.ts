import {revert} from '../../src/api/compose.utils';
import {javascript} from '../../src/api/compose.javascript'
import AdmZip from 'adm-zip'
import mock from 'mock-fs'

test("uncompose returns buffer object", ()=>{

    expect(revert([""],javascript) instanceof Buffer).toBe(true)
})

test("mock",()=>{
})