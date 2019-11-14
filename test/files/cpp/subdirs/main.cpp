#include "./sub/one.h"
#include "./add/one.h"

#include <iostream>

void printArray(int* data, int size){
    for(int i = 0; i < size; i++){
        std::cout << "[" << data[i] << "]";
    }
}

int main(int argc, char** argv){
    const int n = 1;
    int result[n] = {0};
    printArray(result,n);
    add::one::run(result);
    printArray(result,n);
    add::one::run(result);
    printArray(result,n);
    sub::one::run(result);
    printArray(result,n);
    sub::one::run(result);
    printArray(result,n);
    return 0;
}
