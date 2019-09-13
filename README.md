
# line-api-cli-nodejs
[![Actions status](https://github.com/intocode-io/line-api-cli-nodejs/workflows/build/badge.svg)](https://github.com/intocode-io/line-api-cli-nodejs/actions)
[![Codecov](https://codecov.io/gh/intocode-io/line-api-cli-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/intocode-io/line-api-cli-nodejs)
[![Dependencies status](https://david-dm.org/intocode-io/line-api-cli-nodejs/status.svg)](https://david-dm.org/intocode-io/line-api-cli-nodejs)
[![Version](https://img.shields.io/npm/v/@intocode-io/line-api-cli.svg)](https://npmjs.com/package/@intocode-io/line-api-cli)
![NPM](https://img.shields.io/npm/l/@intocode-io/line-api-cli)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/micksatana?locale.x=en_GB)


Command line interface for LINE APIs. This module will help you to easily work with LINE APIs via CLI.

## Installation
```
npm i @intocode-io/line-api-cli -g
```

<img width="414" alt="npm i @intocode-io/line-api-cli -g" src="https://user-images.githubusercontent.com/1315909/64685066-7e4fc380-d4b0-11e9-9c69-11f85fe6dd97.png">

## Project setup
To initialize project configuration file, run the following command.
```
line init
```
It will create `.line-api-cli.yml` configuration file containing necessary information for the CLI to handle API request/response for you.

<img width="507" alt="line init" src="https://user-images.githubusercontent.com/1315909/64685306-f28a6700-d4b0-11e9-94cc-dced718b1c9c.png">


## Issue a short-lived access token
To issue a short-lived access token, run the following command.
```
line token --issue
```
It will issue a short-lived access token. You can choose whether to replace the token into `.line-api-cli.yml`

<img width="529" alt="line token --issue" src="https://user-images.githubusercontent.com/1315909/64685575-6e84af00-d4b1-11e9-8438-6614e81f3d9d.png">

## Revoke access token
To revoke access token, run the following command.
```
line token --revoke
```

## Add a rich menu
To add a rich menu, run the following command.
```
richmenu add
```

<img width="482" alt="richmenu add" src="https://user-images.githubusercontent.com/1315909/64861793-138ebb80-d65b-11e9-8881-b8aaaf185e93.png">

## List rich menus
To list rich menus, run the following command.
```
richmenu list
```

<img width="612" alt="richmenu list" src="https://user-images.githubusercontent.com/1315909/64861824-31f4b700-d65b-11e9-8367-2c782bb8c4c4.png">


## Remove a rich menu
To remove a rich menu, run the following command.
```
richmenu remove
```

<img width="480" alt="richmenu remove" src="https://user-images.githubusercontent.com/1315909/64874774-ef8ca380-d675-11e9-8e53-ac6e334f64b8.gif">

## Comprehensive usage
We provide comprehensive usage of each command / operation / option with CLI. Simply run a command with/without operation and follow by `--help` option. For example,
```
line token --help
```
Or
```
line --help
```

<img width="680" alt="line --help" src="https://user-images.githubusercontent.com/1315909/64685826-d20edc80-d4b1-11e9-82fc-596009d85a87.png">

## License
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

## Images copyright notice

Images used in this repository are not own by any maintainers. Do NOT distribute the images. They are used only for friendly-looking CLI. If a copyright owner would like to remove any image, please open an issue here and we will remove as soon as possible.
