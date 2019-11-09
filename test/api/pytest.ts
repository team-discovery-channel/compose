/* Based on code from https://github.com/jasonrute/modulize
 * */
export let example:any = {}
let main = ["import foo.bar","import os" ,"fb = foo.bar.bar_func(foo.foo_var)","print(fb) # foo bar"]
example["__main__.py"] = main

let init = ["foo_var = 'foo'"]
example["foo/__init__.py"] = init

let bar = ["def bar_func(x):", "    return x + ' bar2'"]
example["foo/bar.py"] = bar
export let desiredOutput = `# -*- coding: utf-8 -*-
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


@modulize('foo')
def _foo(__name__):
    #Begin foo/__init__.py
    foo_var = 'foo'
    #End foo/__init__.py
    return locals()

@modulize('foo.bar')
def _bar(__name__):
    #Begin foo/bar.py
    def bar_func(x):
        return x + ' bar2'
    #End foo/bar.py
    return locals()


def __main__():
    #Begin __main__.py
    import foo.bar
    import os
    fb = foo.bar.bar_func(foo.foo_var)
    print(fb) # foo bar
    #End __main__.py
__main__()
`
