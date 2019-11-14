#include "addone.h"
#include "subone.h"

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
    addone::run(result);
    printArray(result,n);
    addone::run(result);
    printArray(result,n);
    subone::run(result);
    printArray(result,n);
    subone::run(result);
    printArray(result,n);
    return 0;
}
