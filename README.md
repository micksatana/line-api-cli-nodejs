
# line-api-cli-nodejs
[![codecov](https://codecov.io/gh/intocode-io/line-api-cli-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/intocode-io/line-api-cli-nodejs)
[![dependencies Status](https://david-dm.org/intocode-io/line-api-cli-nodejs/status.svg)](https://david-dm.org/intocode-io/line-api-cli-nodejs)

Command line interface for LINE APIs. This module will help you to easily work with LINE APIs via CLI.

## Installation
```
npm i @intocode-io/line-api-cli -g
```

## Project setup
To initialize project configuration file, run the following command.
```
line init
```
It will create `.line-api-cli.yml` configuration file containing necessary information for the CLI to handle API request/response for you.

## Issue a short-lived access token
To issue a short-lived access token, run the following command.
```
line token --issue
```
It will issue a short-lived access token. You can choose whether to replace the token into `.line-api-cli.yml`
