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
    getAbsolutePath = function (base, relative) {
        var base = base.split("/")
        base.pop()
        var baseLength = base.length;
        var relative = relative.split("/")
        var result = []
        
        while(relative.length != 0){
            var sub = relative.pop()
            if(sub == ".")
                continue
            if(sub == ".."){
                base.pop()
            }
            else{
                result.push(sub)
            }
        }
        if(result[0].slice(-3) === ".js"){
          result[0] = result[0].slice(0,-3)
        }
        if(result[result.length-1] !== base[0]){
            while(base.length != 0)
                result.push(base.pop())
        }
        return result.reverse().join("/")
    }
    require = function(parentPath){ return function(path) {
        
        if (module_cache[path]) {
            return module_cache[path].exports;
        }
        path = getAbsolutePath(parentPath,path)
        module_path = find_module(path)
        if (module_path)
        {
            var module = module_cache[module_path] = {exports: {}};
            modules[module_path].call(module.exports, module, module.exports, require(module_path));
        }
        else
        {
            return builtin_require(path);
        }
        return module.exports;
    }
  }
    main = require('simple/index.js')('simple/index');
    require = builtin_require;
    return main;
})(require, {
    'simple/subone.js': (function(module, exports, require) {
//>>>BEGIN<<< simple/subone.js
var run = function(value){
    value[0] -= 1;
}

exports.run = run;
//>>>END<<< simple/subone.js
}),
    'simple/addone.js': (function(module, exports, require) {
//>>>BEGIN<<< simple/addone.js
var run = function(value){
    value[0] += 1;
}

exports.run = run;
//>>>END<<< simple/addone.js
}),
    'simple/index.js': (function(module, exports, require) {
//>>>BEGIN<<< simple/index.js
var addone = require('./addone');
var subone = require('./subone.js');
var result = [0]

console.log = function(data){
    process.stdout.write("["+data.toString()+"]")
}

console.log(result)
addone.run(result)
console.log(result)
addone.run(result)
console.log(result)
subone.run(result)
console.log(result)
subone.run(result)
console.log(result)


//>>>END<<< simple/index.js
}),
})