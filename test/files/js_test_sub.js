(function (require, modules) {
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
})