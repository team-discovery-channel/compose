
ifeq '$(findstring ;,$(PATH))' ';'
    UNAME := Windows
else
    UNAME := $(shell uname 2>/dev/null || echo Unknown)
    UNAME := $(patsubst CYGWIN%,Cygwin,$(UNAME))
    UNAME := $(patsubst MSYS%,MSYS,$(UNAME))
    UNAME := $(patsubst MINGW%,MSYS,$(UNAME))
endif

all: multiplesubdirs

multiplesubdirs: addone.o subone.o divtwo.o multwo.o expr.o
	 g++ main.cpp -o multiplesubdirs.o -W addone.o subone.o divtwo.o multwo.o expr.o
	 multiplesubdirs.o
	 make clean -s --no-print-directory

addone.o:
	gcc -c ./precedence_low/add/one.cpp -I precedence_low/add -o addone.o
subone.o:
	gcc -c ./precedence_low/sub/one.cpp -I precedence_low/sub -o subone.o
multwo.o:
	gcc -c ./precedence_high/mul/two.cpp -I precedence_high/mul -o multwo.o
divtwo.o:
	gcc -c ./precedence_high/div/two.cpp -I precedence_high/div -o divtwo.o
expr.o:
	gcc -c ./expressions/subexpression/expr.cpp -I ./expression/subexpression/ -I ./precedence_low/add -I ./precedence_low/sub -I ./precedence_high/mul -I ./precedence_high/div -o expr.o

clean:
ifeq ($(UNAME),Windows)
	del addone.o subone.o divtwo.o multwo.o expr.o multiplesubdirs.o > NUL
else
	rm addone.o subone.o divtwo.o multwo.o expr.o multiplesubdirs.o > /dev/null
endif