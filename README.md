[![Master Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=master)](https://travis-ci.org/team-discovery-channel/compose)
[![Dev Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=develop)](https://travis-ci.org/team-discovery-channel/compose)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

| Statements | Branches | Functions | Lines |
| -----------|----------|-----------|-------|
| ![Statements](https://img.shields.io/badge/Coverage-99.15%25-brightgreen.svg ) | ![Branches](https://img.shields.io/badge/Coverage-96.61%25-brightgreen.svg ) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg ) | ![Lines](https://img.shields.io/badge/Coverage-99.15%25-brightgreen.svg ) |

# COMPOSE

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
1. Run using developer tools (nodemon enabled).
```bash
npm run dev
```
2. Run without developer tools
```bash
npm start
```
3. How to access web interface
```bash
localhost:8080
```
4. How to access typedoc (auto-generated documentation)
```bash
localhost:8080/docs
```

## Purpose
To simplify the process of uploading code to code competition websites.

## Development Roadmap
1. Languages supported currently
  * Javascript
  * Python
2. Languages in development
  * C++

## Notes for developers/maintainers
### To add a language:
1. Implement the interface Language, found in src/api/language.ts
2. Register the language to the languages dictionary found in src/api/languages.ts. Use the language's simple, lowercase, name for the key.

## Developer Documentation

[Compose API v1](team-discovery-channel.github.io/compose)

`/src/api/*.ts` includes all functions
1. Base Classes
  1. `src\api\Language.ts`
    1. Typescript module used for creating other programming languages for compose
    2. Each extended language module will include the name of the language, comment characters for language, and extensions used for language.
1. Javascript Implementation
  1. `src\api\Javascript.ts` is the core file for composing javascript files.
    1. It imports `src\api\Javascript.utils.ts` which includes utility functions used by javascript.ts
        * `filterFiles` - recursively search for dependent files based on main file
        * `findModule` -  search for filename of a module
        * `getAbsolutePath` - converts relative paths to absolute paths of modules
    2. Extends `src\api\language.ts`
  2. Order

## PRESUMPTIONS/PRECONDITIONS/ASSUMPTIONS
##


### TRAVIS CI Setup
1. Sign into travis-ci.com using your GitHub account.
2. Activate your repository through Travis CI.
3. Builds can either be triggered manually or will automatically build during the next update to the repository.
* Modify `.travis.yml` for any Travis CI configurations
