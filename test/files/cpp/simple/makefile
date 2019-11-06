
ifeq '$(findstring ;,$(PATH))' ';'
    UNAME := Windows
else
    UNAME := $(shell uname 2>/dev/null || echo Unknown)
    UNAME := $(patsubst CYGWIN%,Cygwin,$(UNAME))
    UNAME := $(patsubst MSYS%,MSYS,$(UNAME))
    UNAME := $(patsubst MINGW%,MSYS,$(UNAME))
endif

all: simple

simple: addone.o subone.o
	 g++ main.cpp -o simple.o -W addone.o subone.o
	 simple.o
	 make clean -s --no-print-directory

addone.o:
	gcc -c addone.cpp -o addone.o
subone.o:
	gcc -c subone.cpp -o subone.o

clean:
ifeq ($(UNAME),Windows)
	del subone.o addone.o simple.o > NUL
else
	rm subone.o addone.o simple.o > /dev/null
endif