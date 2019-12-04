[![Master Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=master)](https://travis-ci.org/team-discovery-channel/compose)
[![Dev Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=develop)](https://travis-ci.org/team-discovery-channel/compose)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

| Statements | Branches | Functions | Lines |
| -----------|----------|-----------|-------|
| ![Statements](https://img.shields.io/badge/Coverage-97.5%25-brightgreen.svg ) | ![Branches](https://img.shields.io/badge/Coverage-93.44%25-brightgreen.svg ) | ![Functions](https://img.shields.io/badge/Coverage-97.3%25-brightgreen.svg ) | ![Lines](https://img.shields.io/badge/Coverage-97.49%25-brightgreen.svg ) |

# COMPOSE

## Installation
### Required installations:
* NodeJS (v8+)

### How To Install Project
###### Clone the repository using git or download as a zip

```bash
$ cd compose
```

3.  Create a file called __".env"__ with the following text under *compose* folder

```bash
 NODE_ENV=development
 SERVER_PORT=8080
```

**Note** - *The file `.env.sample` can be renamed as `.env`
For more information on dotenv files: https://www.npmjs.com/package/dotenv*

4. Install necessary node packages

```bash
npm install
```

## How to Run the App
1. Run using developer tools (nodemon enabled). This allows changes to the source code to be reflected by the server as soon as changes are saved.
```bash
npm run dev
```
2. Run without developer tools
```bash
npm start
```
3. How to access web interface. To use a port other than 8080 change the SERVER_PORT variable in .env.
```bash
localhost:8080
```
4. How to access typedoc (auto-generated documentation)
```bash
localhost:8080/docs
```

Other Node Commands:

`npm lint` - run linting over source code.

`npm run test` - run test suite and generate coverage reports.

`npm run apidoc` - update the API documentation found at `server:port/docs` (i.e. `localhost:8080/docs`) and in the /dist folder.


## HTTP API
Users can bypass the GUI interface and make requests through HTTP and a program like cURL or HTTPie. Web API found below.

[Compose API v1](https://team-discovery-channel.github.io/compose/files/api.html)
  * Note: API documentation is generated from api.raml, to get most up to date api documentation run ```npm run dev``` and go to ```localhost:8080/docs/api.html```

## Purpose
To simplify the process of uploading code to code competition websites.

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
