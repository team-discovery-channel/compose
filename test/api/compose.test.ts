import {compose} from '../../src/api/index';
import { TIMEOUT } from 'dns';
import { resolve } from 'url';
import { javascript } from '../../src/api/compose.javascript'
import { Language } from '../../src/api/compose.language'
import { filterFiles, revert } from '../../src/api/compose.utils';



test("Expected return from compose must be valid json", () => {

    const validJson = () => {
        compose({"hello_world.js":["Line 1", "Line 2","line 3","Line 4"]})
    };

    expect(validJson)
        .not
        .toThrow();
});

const jsFiles = {
  language: "javascript",
  files: {
      "file1": ["require('file2')", "require('file3')"],
      "file2": ["require('file4')", "console.log('Im')"],
      "file3.js": ["console.log('Alive')"],
      "file4/index.js": ["require('file6')", "console.log('Help')"]
  },
  filenames: [ 'file3.js', 'file4/index.js', 'file2', 'file1' ],
  entryFilename: "file1"
}

// TODO: create interface in routes
//===========================================
const languages = {
  list: [javascript],
};

const languageFactory = (name: string): Language => {
  const lang: Language[] = languages.list.filter(
    (lang: Language) => lang.getName() === name
  );
  if (lang.length === 0) {
    throw new Error(
      `languageFactory in routes/index.ts has no instance for ${name}`
    );
  }
  return lang[0];
};

const languageInstance: Language = languageFactory(jsFiles.language);
//===========================================


test("first test for javascript compose", ()=>
  {
    const validFilterFiles =
      filterFiles(
        jsFiles.files,
        languageInstance,
        jsFiles.entryFilename,
        languageInstance.getRegex()
      );

    expect(validFilterFiles).toMatchObject(jsFiles.filenames)

    //console.log(javascript.compose(jsfilenames1, jsfiles1))
  }
)

const jsFilesOutput = `(function (require, modules) {
    var module_cache = {};
    const builtin_require = require;
    const find_module = function(path) {
        if (/.js$/.test(path))
            exts = ['']
        else
            exts = ['', '.js', '/index.js']
        for(let module_name of Object.keys(modules))
        {
            for(let ext of exts)
            {
                if (module_name === path+ext) return module_name;
            }
        }
        return false;
    }
    require = function(path) {
        if (module_cache[path]) {
            return module_cache[path].exports;
        }
        module_path = find_module(path)
        if (module_path)
        {
            var module = module_cache[module_path] = {exports: {}};
            modules[module_path].call(module.exports, module, module.exports, require);
        }
        else
        {
            return builtin_require(path);
        }
        return module.exports;
    }
    main = require('main.js');
    require = builtin_require;
    return main;
})(require, {
    'module3.js': (function(module, exports, require) {
//>>>BEGIN<<< sub/module3.js
var x = 3;
this.x = x + 1;
//this == module.exports == exports in this context...
exports.module3_function = function(){
    return this.x;
}
//>>>END<<< sub/module3.js
}),
    'module2.js': (function(module, exports, require) {
//>>>BEGIN<<< sub/module2.js
exports.module2_function = function(){
    var x = 2;
    return x;
}
//>>>END<<< sub/module2.js
}),
    'module1.js': (function(module, exports, require) {
//>>>BEGIN<<< sub/module1.js
exports.module1_function = function(){
    var x = 1;
    return x;
}
//>>>END<<< sub/module1.js
}),
    'main.js': (function(module, exports, require) {
//>>>BEGIN<<< main.js
var module1 = require('module1');
var module2 = require('module2');
var module3 = require('module3');

function main(){
    console.log(module1.module1_function());
    console.log(module2.module2_function());
    console.log(module3.module3_function());
}

main();

exports.main = main;
//>>>END<<< main.js
}),
})`

test("first test for javascript compose", ()=>
  {

    expect(languageInstance.compose(jsFiles.filenames, jsFiles.files)).toMatch(jsFilesOutput)

    //console.log(javascript.compose(jsfilenames1, jsfiles1))
  }
)
