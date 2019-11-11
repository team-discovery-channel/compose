var add = require('./add/one');
var sub = require('./sub/one.js');
var result = [0]

console.log = function(data){
    process.stdout.write("["+data.toString()+"]")
}

console.log(result)
add.run(result)
console.log(result)
add.run(result)
console.log(result)
sub.run(result)
console.log(result)
sub.run(result)
console.log(result)