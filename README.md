[![Master Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=master)](https://travis-ci.org/team-discovery-channel/compose)
[![Dev Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=develop)](https://travis-ci.org/team-discovery-channel/compose)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

| Statements | Branches | Functions | Lines |
| -----------|----------|-----------|-------|
| ![Statements](https://img.shields.io/badge/Coverage-99.15%25-brightgreen.svg ) | ![Branches](https://img.shields.io/badge/Coverage-96.61%25-brightgreen.svg ) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg ) | ![Lines](https://img.shields.io/badge/Coverage-99.15%25-brightgreen.svg ) |

![Compose logo](https://team-discovery-channel.github.io/compose/imgs/banner_plain.jpg "Composing source files")

Compose allows programmers to compile a single file from multiple folders and files for competition programming websites. Compose is implemented in typescript.

## Installation
### Required installations:
* NodeJS (v12)

## How To Install the Project
1. Clone the repository from Git.

```bash
$ git clone https://github.com/team-discovery-channel/compose.git
```
<br/>
2. Change directory to cloned repository

```bash
$ cd compose
```

3.  Create a file called __".env"__ with the following text under *compose* folder

```bash
 NODE_ENV=development
 SERVER_PORT=8080
```

**  Note: The file `.env.sample` can be renamed as `.env`
For more information on dotenv files: https://www.npmjs.com/package/dotenv **

4. Install necessary node packages

```bash
npm install
```

## How to Run the Project
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

## PRESUMPTIONS/PRECONDITIONS/ASSUMPTIONS
  #### Compose
  #### Revert
  1. The Language methods are implemented and the comment guard wrapping source files is of the form of a single line comment followed by the begin guard or end guard.
  2. The begin and end guard must be distinct and not a substring of one another.
  3. Any edits to the source between guards must be done in a way that it can be undone by a per-line map function. The [Language](src/api/language.ts) class has a protected member function, processline, that can be overwritten by language imeplementations to facilitate this, an example can be found in python class.
##


### TRAVIS CI Setup
1. Sign into travis-ci.com using your GitHub account.
2. Activate your repository through Travis CI.
3. Builds can either be triggered manually or will automatically build during the next update to the repository.
* Modify `.travis.yml` for any Travis CI configurations
