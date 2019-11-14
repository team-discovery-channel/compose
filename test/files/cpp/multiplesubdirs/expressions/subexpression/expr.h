#ifndef __EXPR__H
#define __EXPR__H
#include "../../precedence_low/add/one.h"
#include "../../precedence_low/sub/one.h"
#include "../../precedence_high/div/two.h"
#include "../../precedence_high/mul/two.h"
#include<iostream>

namespace expression{
    void printArray(int* data, int size);
    void run(int* result);
    namespace subexpression{
        void run(int* result);
    }
}
#endif