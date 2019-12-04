import {revert} from '../../src/api/revert'
import {constructDirectoryObject, Directory} from '../../src/api/revert'
import {filterFiles} from '../../src/api/javascript.utils';
import {languages} from "../../src/api/languages"
import {javascript} from '../../src/api/javascript'
import {Language} from '../../src/api/language'
import AdmZip from 'adm-zip'
import mock from 'mock-fs'

const language = "javascript"
const languageInstance:Language = languages[language]

test("uncompose returns buffer object", ()=>{

    expect(revert(Buffer.from(""),language) instanceof Buffer).toBe(true)
})

test("compose is revertable",()=>{
    const zip = new AdmZip("./test/files/js_test_sub.zip");

    const files = zip
        .getEntries()
        .filter(entry => !entry.isDirectory)
        .reduce<{ [index: string]: string[] }>((acc, entry) => {
          acc[
            entry.entryName
              .split('/')
              .slice(1)
              .join('/')
          ] = entry
            .getData()
            .toString('utf-8')
            .split('\n');
          return acc;
        }, {});


    const composedFile: string = languageInstance.compose(
        "main.js",
        files
    );

    const cmp:Buffer = revert(Buffer.from(composedFile),language);

    const rzip = new AdmZip(cmp);
    let zipRoot = "";
    const zipFiles = zip.getEntries().map((entry)=>{
        zipRoot = entry.entryName.split("/")[0]
        return entry.entryName.split("/").slice(1).join("/")
    })

})

test("Valid directory object is formed from list of paths", ()=>{
    const ext = languageInstance.getExtensions()[0]
    const paths = [ `/root/main${ext}`,
                    `/root/files/module1${ext}`,
                    `/root/files/module2${ext}`,
                    `/root/files/module3${ext}`,
                    `/root/files/subs/module1${ext}`,
                    `/root/files/subs/sub1/sub2/sub3/module1${ext}`]
    let dir:Directory = {}
    dir["/"] = {}
    paths.forEach((path)=>{
        constructDirectoryObject(path.split("/").slice(0,-1).reverse(),dir, dir["/"])
    })

    dir = dir["/"]
    expect("root" in dir).toBe(true);
    expect("files" in dir.root).toBe(true);
    expect("subs" in dir.root.files).toBe(true);
    expect(`test${ext}` in dir.root).toBe(false);
})
