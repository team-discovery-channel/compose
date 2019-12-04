## Development Roadmap
1. Languages supported currently
  * Javascript
  * Python
2. Languages in development
  * C++

## Notes for developers/maintainers
This project runs off a general web MVC architecture implemented by Node Express.

[`/src/api/`](src/api/) contains the model logic including the language specific logic

[`/src/controllers`](src/controllers/) and [`/src/views/`](src/views/) contain the logic for controllers and views respectively.

[`/src/routes/`](src/routes/) contains HTTP routing instructions for Node Express.

[`tests/api/`](tests/api) Contains the tests. New tests can be added, using the JEST framework. The test suite can be run with the node command `npm run test`

### To Add A New Language
New languages can be easily added and registered to the program. First make a new class that extends the abstract class [`/src/api/language.ts`](src/api/language.ts). At a minimum, the class variables name, exts, and comment are likely to need to be defined for the new language. However, the most important function is the compose function.

The compose function takes two parameters. The first is a dictionary of the user uploaded zip file. The dictionary's values are the files converted to string arrays (line by line, preserving whitespacing). The keys are the full filepaths of each file including the name of the zip as the top level directory. For example, foo/\_\_init\_\_.py is zipped into a folder named mydir, that file's key would be my_dir/foo/\_\_init\_\_.py. The other parameter is the user defined entry or main filename in the same format. The function needs to return the single, combined, file as a string.

[`src/api/languages.ts`](src/api/languages.ts) is where the program keeps track of included languages. Simply add new languages to the dictionary and the front end will automatically incorporate it, and the backend will know how to call it. The  is how the app will recognize the language in HTTP requests and is how it will display on the view, so make sure it's recognizable.

### Testing A New Language
 #### Unit testing
 * Compose uses Jest as the testing framework
 * Add unit tests in the [`test/api/`](test/api/) directory in a file named ```<common language name>.test.ts```
 
 #### Integration testing
 * Once your language is implemented create test directories and source files
   1. go to [`test/files/`](test/files/) and create a directory with the name the same as the common language name
   2. In that directory create a config.json which has the following structure   
```
    {
    "command": {"win32": string, "else": string} | string, //the command format string with a single %s
    "entry": string, //full path from root of zip archive to the main file
    <name of test sub directories :string>: string, // the expected result from running the command
    }
```
 * 
   3. Now create the sub directories with test source files, run them, copy the outputs to the corresponding JSON property in the config.json

## PRESUMPTIONS/PRECONDITIONS/ASSUMPTIONS
  #### Revert
  1. The Language methods are implemented and the comment guard wrapping source files is of the form of a single line comment followed by the begin guard or end guard.
  2. The begin and end guard must be distinct and not a substring of one another.
  3. Any edits to the source between guards must be done in a way that it can be undone by a per-line map function. The [Language](src/api/language.ts) class has a protected member function, processLine, that can be overwritten by language imeplementations to facilitate this, an example can be found in python class.
##


### TRAVIS CI Setup
1. Sign into travis-ci.com using your GitHub account.
2. Activate your repository through Travis CI.
3. Builds can either be triggered manually or will automatically build during the next update to the repository.

## Issues
 * The revert function when using linux has a root directory named "undefined" but otherwise reproduces the source zip file. The issue was narrowed to the mock file system called in the revert function.