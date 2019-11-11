var addone = require('./addone');
var subone = require('./subone.js');
var result = [0]

console.log = function(data){
    process.stdout.write("["+data.toString()+"]")
}

console.log(result)
addone.run(result)
console.log(result)
addone.run(result)
console.log(result)
subone.run(result)
console.log(result)
subone.run(result)
console.log(result)

