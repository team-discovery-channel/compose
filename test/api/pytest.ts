export let example:any = {}
let main = ["import foo.bar", "fb = foo.bar.bar_func(foo.foo_var)","print(fb) # foo bar"]
example["__main__.py"] = main

let init = ["foo_var = 'foo'"]
example["foo/__init__.py"] = init

let bar = ["def bar_func(x):", "    return x + ' bar2'"]
example["foo/bar.py"] = bar

