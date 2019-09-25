import { Composable, Language } from './compose.language';

/**
 * composes javascript source files.
 */
class Javascript extends Language {
  constructor() {
    super('javascript', ['.js', '/index.js', '']);
  }
  getRegex(): RegExp[] {
    return [/require\((['"])([^'"]+)\1\)/];
  }
  /**
   * @param filelist ordered list of files returned by filterFiles. Last index is the entrypoint
   * @param files the files from the zip
   * @returns composedFile the combined file of
   */
  compose(filelist: string[], files: { [index: string]: string[] }): string {
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
    main = require('${filelist[filelist.length - 1]}');
    require = builtin_require;
    return main;
})(require, {`;
    for (const filename of filelist) {
      const modname = filename
        .split('/')
        .slice(-1)
        .join('/');
      const contentWrapper = [
        `
    '${modname}': (function(module, exports, require) {
//  Begin ${filename}\n`,
        `
//  End ${filename}
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
export const javascript = new Javascript();
