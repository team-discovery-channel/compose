var add = require('./expressions');
var result = [0]

console.log = function(data){
    process.stdout.write("["+data.toString()+"]")
}

add.run(result)