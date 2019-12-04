import { Composable, Language } from './language';
import * as utils from './python.utils';
/*
 * composes python source files
 */
class Python extends Language {
  /**
   * @returns Returns Language with Python package
   */
  constructor() {
    super('python', ['.py', '__init__.py', '']);
    this.comment = '#';
    this.beginGuard = 'Begin';
    this.endGuard = 'End';
  }
  /**
   * @param mainfile Filename of consisting of entry point from source files
   * @param files Filenames from source files
   * @returns Flattened file with runnable composed functions in clear text format
   */
  compose(mainFile: string, files: { [index: string]: string[] }): string {
    let combined = `# -*- coding: utf-8 -*-
import sys
from types import ModuleType
import builtins

buildin_import = builtins.__import__


def compose_import(name, global_context=None, local_context=None, fromlist=(), level=0):
    if name in MockModule.mocks:
        modparts = name.split(".")
        modparts.reverse()
        mod = sys.modules[modparts.pop()]
        while(len(modparts) != 0):
            if level == 0:
                break
            mod = mod.__dict__[modparts.pop()]
            level -= 1
        return mod
    return buildin_import(name,global_context,local_context,fromlist,level)

builtins.__import__ = compose_import

class MockModule(ModuleType):
    mocks = {}
    @staticmethod
    def get_mock(name):
        return MockModule.mocks[name]
        
    def __init__(self, module_name, module_doc=None):
        ModuleType.__init__(self, module_name, module_doc)
        if '.' in module_name:
            package, module = module_name.rsplit('.', 1)
            get_mock_module(package).__path__ = []
            setattr(get_mock_module(package), module, self)
    def _initialize_(self, module_code):
        self.__dict__.update(module_code(self.__name__))
        self.__doc__ = module_code.__doc__
def get_mock_module(module_name):
    if module_name not in sys.modules:
        sys.modules[module_name] = MockModule(module_name)
    MockModule.mocks[module_name] = sys.modules[module_name]
    return sys.modules[module_name]
def modulize(module_name, dependencies=[]):
    for d in dependencies:
        get_mock_module(d)
    return get_mock_module(module_name)._initialize_

##===========================================================================##

`;
    let base = mainFile
      .split('/')
      .slice(0, -1)
      .join('/');
    base = base === '' ? '' : base + '/';
    const modList = utils.parseImportStructure(files, mainFile, base);
    for (const modName of Object.keys(modList)) {
      const deps = modList[modName];
      const filetext = files[modName].join('\n');
      const blk = utils.block(
        modName,
        utils.fileToModule(modName, mainFile, base),
        filetext,
        deps
      );
      combined = combined.concat(blk);
    }
    return combined;
  }

  /**
   * Undoes per line modification by the python compose method
   * @param line of the composed file
   * @returns line minus the 4 spaces add by python compose
   */
  processLine(line: string): string {
    return line.slice(4);
  }
}

export const python = new Python();
