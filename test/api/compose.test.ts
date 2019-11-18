import fs from 'fs';
import AdmZip from 'adm-zip'
import util from 'util'
import {compose} from '../../src/api/compose'
import {composeFile} from '../../src/controllers/compose.controller'
import { file } from 'mock-fs';

const lang = "javascript"
const testDir = "./test/files/%s/%s"

test("response codes from direct api calls", ()=>{
    const zip:AdmZip = new AdmZip()
    const dir = util.format(testDir, lang, "simple")
    zip.addLocalFolder(dir)

    expect(()=>compose(Buffer.from("not a zip"), lang, {filename:""}, "index.js")).toThrowError("400")
    expect(()=>compose(zip.toBuffer(), lang, {filename:""}, "doesnt_exist.js")).toThrowError("404")
    expect(()=>compose(zip.toBuffer(), lang, {filename:""}, "sub")).toThrowError("404")
    expect(()=>compose(zip.toBuffer(), lang, {filename:""}, "one")).toThrowError("404")
    expect(()=>compose(zip.toBuffer(), "not a language", {filename:""}, "index.js")).toThrowError("501")
})

test("server response using direct api call", ()=>{
    const zip:AdmZip = new AdmZip()
    const dir = util.format(testDir, lang, "simple")
    zip.addLocalFolder(dir)
    const data = {
        status:200,
        json:"",
        set:""
    }
    const res = {
        status: (code:number)=>{data.status = code},
        json: (response:string)=>{data.json = response},
        set: (key:string, value:string)=>{data.set += key+"..."+value}
    }
    const req = ()=>{
        return {
            file: "set",
            body: {
                entry: "set",
                out: "set",
                language: "set"
            },
        }
    }
    const withoutFile = req()
    delete withoutFile.file
    composeFile(withoutFile,res)
    expect(data.status).toEqual(400)

    const withoutEntry = req()
    delete withoutEntry.body.entry
    composeFile(withoutEntry,res)
    expect(data.status).toEqual(400)

    const withoutLanguage = req()
    delete withoutLanguage.body.language
    composeFile(withoutLanguage,res)
    expect(data.status).toEqual(501)

})



