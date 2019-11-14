#include "expr.h"

void expression::printArray(int* data, int size){
    for(int i = 0; i < size; i++){
        std::cout << "[" << data[i] << "]";
    }
}

void expression::subexpression::run(int* result){
    expression::printArray(result,1);
    add::one::run(result);
    expression::printArray(result,1);
    sub::one::run(result);
    expression::printArray(result,1);
}

void expression::run(int* result){
    expression::subexpression::run(result);
    expression::printArray(result,1);
    add::one::run(result);
    expression::printArray(result,1);
    mul::two::run(result);
    expression::printArray(result,1);
    div2::two::run(result);
    expression::printArray(result,1);
    sub::one::run(result);
    expression::printArray(result,1);
}