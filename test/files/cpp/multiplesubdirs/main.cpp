#include "expressions/subexpression/expr.h"

#include <iostream>

void printArray(int* data, int size){
    for(int i = 0; i < size; i++){
        std::cout << "[" << data[i] << "]";
    }
}

int main(int argc, char** argv){
    const int n = 1;
    int result[n] = {0};
    expression::run(result);
    return 0;
}