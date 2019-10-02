import {revert, constructDirectoryObject, filterFiles, Directory} from '../../src/api/compose.utils';
import {javascript} from '../../src/api/compose.javascript'
import {Language} from '../../src/api/compose.language'
import AdmZip from 'adm-zip'
import mock from 'mock-fs'

const languageInstance:Language = javascript

test("uncompose returns buffer object", ()=>{

    expect(revert([""],languageInstance) instanceof Buffer).toBe(true)
})

test("compose is revertable",()=>{
    //console.log(fs.readdirSync("./test/files/multiple_sub_dirs.zip"))
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
    const filenames: string[] = filterFiles(
        files,
        languageInstance,
        "main.js",
        languageInstance.getRegex()
    );

    const composedFile: string = languageInstance.compose(
        filenames,
        files
    );

    const cmp:Buffer = revert(composedFile.split("\r").join("").split("\n"),languageInstance);
    
    const rzip = new AdmZip(cmp);
    let zipRoot = "";
    const zipFiles = zip.getEntries().map((entry)=>{
        zipRoot = entry.entryName.split("/")[0]
        return entry.entryName.split("/").slice(1).join("/")
    })
    rzip.getEntries().filter((entry)=>!entry.isDirectory).forEach((entry)=>{
        console.log(entry.entryName)
    })
    rzip.getEntries().filter((entry)=>!entry.isDirectory).forEach((entry)=>{
        expect(zipFiles).toContainEqual(entry.entryName)
        const rzipFile = entry.getData().toString("utf-8").trim();
        const zipFile = zip.getEntry(zipRoot+"/"+entry.entryName)
                                .getData()
                                .toString("utf-8")
                                .trim()
        expect(rzipFile === zipFile)
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
        constructDirectoryObject(path.split("/").slice(0,-1).reverse(),dir)
    })
    
    dir = dir["/"]
    expect("root" in dir).toBe(true);
    expect("files" in dir.root).toBe(true);
    expect("subs" in dir.root.files).toBe(true);
    expect(`test${ext}` in dir.root).toBe(false);
})