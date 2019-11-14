var modules = {
    add:require('../precedence_low/add/one.js'),
    sub:require('../precedence_low/sub/one.js'),
    mul:require('../precedence_high/mul/two.js'),
    div:require('../precedence_high/div/two.js'),
    expr:require('./subexpression')
}

var run = function(value){
    modules.expr.run(value)
    console.log(value)
    modules.add.run(value);
    console.log(value)
    modules.mul.run(value);
    console.log(value)
    modules.div.run(value);
    console.log(value)
    modules.sub.run(value);
    console.log(value)
}

exports.run = run;