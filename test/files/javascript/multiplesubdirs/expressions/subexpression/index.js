var modules = {
    add:require('../../precedence_low/add/one.js'),
    sub:require('../../precedence_low/sub/one.js'),
}

var run = function(value){
    console.log(value)
    modules.add.run(value);
    console.log(value)
    modules.sub.run(value);
    console.log(value)
}

exports.run = run;