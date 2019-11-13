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
  }
  /**
   * @returns returns regex which filters for any "import **module** from **function**" string
   */
  getRegex(): RegExp[] {
    return [/^\s*import\s+([A-Z,a-z]+)\1/, /from\s+([A-Z,a-z])+\1/];
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
class MockModule(ModuleType):
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
    return sys.modules[module_name]
def modulize(module_name, dependencies=[]):
    for d in dependencies:
        get_mock_module(d)
    return get_mock_module(module_name)._initialize_

##===========================================================================##

`;
    const modList = utils.parseImportStructure(files, mainFile);
    for (const modName of Object.keys(modList)) {
      const deps = modList[modName];
      const filetext = files[modName].join('\n');
      const blk = utils.block(
        modName,
        utils.fileToModule(modName, mainFile),
        filetext,
        deps
      );
      combined = combined.concat(blk);
    }
    return combined;
  }
}

export const python = new Python();
