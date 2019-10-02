var x = 3;
this.x = x + 1;
//this == module.exports == exports in this context...
exports.module3_function = function(){
    return this.x;
}