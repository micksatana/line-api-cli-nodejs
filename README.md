
# line-api-cli-nodejs
[![codecov](https://codecov.io/gh/intocode-io/line-api-cli-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/intocode-io/line-api-cli-nodejs)
[![dependencies Status](https://david-dm.org/intocode-io/line-api-cli-nodejs/status.svg)](https://david-dm.org/intocode-io/line-api-cli-nodejs)

Command line interface for LINE APIs. This module will help you to easily work with LINE APIs via CLI.

## Installation
```
npm i @intocode-io/line-api-cli -g
```

<img width="414" alt="sample-npm-i" src="https://user-images.githubusercontent.com/1315909/64685066-7e4fc380-d4b0-11e9-9c69-11f85fe6dd97.png">

## Project setup
To initialize project configuration file, run the following command.
```
line init
```
It will create `.line-api-cli.yml` configuration file containing necessary information for the CLI to handle API request/response for you.

<img width="507" alt="sample-line-init" src="https://user-images.githubusercontent.com/1315909/64685306-f28a6700-d4b0-11e9-94cc-dced718b1c9c.png">


## Issue a short-lived access token
To issue a short-lived access token, run the following command.
```
line token --issue
```
It will issue a short-lived access token. You can choose whether to replace the token into `.line-api-cli.yml`

<img width="529" alt="sample-issue-access-token" src="https://user-images.githubusercontent.com/1315909/64685575-6e84af00-d4b1-11e9-8438-6614e81f3d9d.png">

# License
MIT License

Copyright (c) 2019 intocode Co., Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

