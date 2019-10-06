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