import { Composable, Language } from './language';
import { filterFiles } from './javascript.utils';
/**
 * Javascript Language Package that composes javascript source files.
 */
class Javascript extends Language {
  /**
   * Defines comment convention for javascript
   */
  comment = '//';

  /**
   * @returns Returns Language with Javascript package
   */
  constructor() {
    super('javascript', ['.js', '/index.js', '']);
  }

  /**
   * @returns returns regex which filters for any "require **module**" string
   */
  getRegex(): RegExp[] {
    return [/require\((['"])([^'"]+)\1\)/];
  }

  /**
   * Defines compose behavior for javascript projects.
   * @param mainfile Filename of consisting of entry point from source files
   * @param files Filenames from source files
   * @returns Flattened file with runnable composed functions in clear text format
   */
  compose(mainfile: string, files: { [index: string]: string[] }): string {
    const filelist = filterFiles(
      files,
      javascript,
      mainfile,
      javascript.getRegex()
    );
    let content = `(function (require, modules) {
    var module_cache = {};
    const builtin_require = require;
    const find_module = function(path) {
        if (/\.js$/.test(path))
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
    main = require('${filelist[filelist.length - 1]}')('${
      filelist[filelist.length - 1].split('.')[0]
    }');
    require = builtin_require;
    return main;
})(require, {`;
    for (const filename of filelist) {
      const modkey = filename;
      const contentWrapper = [
        `
    '${modkey}': (function(module, exports, require) {
${this.comment}${this.getBeginGuard()} ${filename}\n`,
        `
${this.comment}${this.getEndGuard()} ${filename}
}),`,
      ];
      const curfile: string[] = files[filename];
      const fileString: string =
        contentWrapper[0] + curfile.join('\n') + contentWrapper[1];
      content += fileString;
    }
    return content + `\n})`;
  }
}

/**
 * Javascript Language Package
 */
export const javascript = new Javascript();
