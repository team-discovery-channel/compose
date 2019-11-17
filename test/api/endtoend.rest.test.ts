import {languages} from '../../src/api/languages'
import AdmZip from 'adm-zip'
import  util  from 'util'
import express from 'express';
import path from 'path';
import * as routes from '../../src/routes';
import fs from 'fs'
import http from 'http'
import * as child from 'child_process'
const request = require('supertest')
import rimraf = require('rimraf');
import upath from 'upath'
import { isFlowPredicate } from '@babel/types';


const baseDir =  "./test/files";

describe('End to end REST testing per language', () => {
    jest.setTimeout(20000)
    let app:any, server:any;
    const tmpDir = `${baseDir}/tmp`

    beforeAll(done => {
        if(!fs.existsSync(tmpDir))
        {
            fs.mkdirSync(tmpDir)
        }
        rimraf.sync(tmpDir+"/**/*")
        app = express();

        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        routes.register(app);
        server = http.createServer(app);

        server.listen(done);
    });

    afterAll(done => {
        rimraf(tmpDir+"/**/*",()=>{server.close(done);})
    });

    test("REST calls on each language over test files", async (done)=>{
        const promises:Array<Promise<boolean>> = []
        Object.keys(languages).forEach((lang)=>{
            const ext:string = languages[lang].getExtensions()[0]
            const langTestFiles = `${baseDir}/${lang}`
            const testfiles:string[] = fs.readdirSync(langTestFiles).filter(fn=>fn!=="config.json");
            const config = JSON.parse(fs.readFileSync(langTestFiles+"/config.json").toString())
            if(typeof config.command !== "string"){
                config.command = config.command[(process.platform === "win32")?"win32":"else"];
            }
            testfiles.forEach(async(dir)=>{
                const zip:AdmZip = new AdmZip()
                zip.addLocalFolder(`${langTestFiles}/${dir}`)
                fs.writeFileSync(`${tmpDir}/${lang}_${dir}.zip`,zip.toBuffer())
                promises.push(new Promise(async (resolve,reject)=>{
                    const script:fs.WriteStream = fs.createWriteStream(`${tmpDir}/${dir}${ext}`)
                    script.on("finish",()=>{
                        const result:string = child.execSync(util.format(config.command,`${tmpDir}/${dir}${ext}`),{cwd:".", timeout:2000}).toString()
                        if(result === config[dir]){
                                resolve(true)
                            }
                            else{
                                resolve(false)
                            }
                    })
                    request(app).post('/api/v1/compose')
                        .field("language", lang)
                        .field("entry",config.entry)
                        .attach("file",`${tmpDir}/${lang}_${dir}.zip`)
                        .pipe(script)
                }))
            })
        })
        const results:boolean[] = await Promise.all(promises)
        expect(results).toEqual(expect.arrayContaining([true]))
        done()
    })

});
