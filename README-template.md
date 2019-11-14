[![Master Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=master)](https://travis-ci.org/team-discovery-channel/compose)
[![Dev Build Status](https://travis-ci.org/team-discovery-channel/compose.svg?branch=develop)](https://travis-ci.org/team-discovery-channel/compose)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

| Statements | Branches | Functions | Lines |
| -----------|----------|-----------|-------|
| ![Statements](#statements# ) | ![Branches](#branches# ) | ![Functions](#functions# ) | ![Lines](#lines# ) |

# COMPOSE


## Installation
### Required installations:
* NodeJS (v12)

### How To Install Project
1. `git clone https://github.com/team-discovery-channel/compose/tree/develop`
2. `cd *compose_folder*`
3.  Create a file called ".env" with the following text under *compose_folder*
  * NODE_ENV=development
  * SERVER_PORT=8080
4. `npm install`

**  Notes: There is a file `.env.sample` that needs to be used as a template for `.env` before it can run.
see: https://www.npmjs.com/package/dotenv **

## How to Run Project
* To run development environment: `npm run dev`
* To run production environment: `npm start`
* Browse to "localhost:8080/" on your browser to run Compose
* Browse to "localhost:8080/docs" to view documentation

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

## TRAVIS CI
### Setup
1. Sign into travis-ci.com using your GitHub account.
2. Activate your repository through Travis CI.
3. Builds can either be triggered manually or will automatically build during the next update to the repository.
