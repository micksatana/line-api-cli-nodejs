
# line-api-cli-nodejs
[![Actions status](https://github.com/intocode-io/line-api-cli-nodejs/workflows/build/badge.svg)](https://github.com/intocode-io/line-api-cli-nodejs/actions)
[![Codecov](https://codecov.io/gh/intocode-io/line-api-cli-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/intocode-io/line-api-cli-nodejs)
[![Dependencies status](https://david-dm.org/intocode-io/line-api-cli-nodejs/status.svg)](https://david-dm.org/intocode-io/line-api-cli-nodejs)
[![Version](https://img.shields.io/npm/v/@intocode-io/line-api-cli.svg)](https://npmjs.com/package/@intocode-io/line-api-cli)
![NPM](https://img.shields.io/npm/l/@intocode-io/line-api-cli)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/micksatana?locale.x=en_GB)

Command line interface for LINE APIs. This module will help you to easily work with LINE APIs via CLI.

## Short summary

LINE API CLI helps you to work with LINE-API-related projects faster as you do not need to switch between a web browser and IDE ( after your first-time setup :P ). If you already are a hardcore "Terminal/Console" fanboy that using cURL to work with LINE APIs, using this package will reduce your time typing same long API cURL commands.

### Available commands, operations, and options

 - `line`
    - `init`
    - `token`
      - `--issue`
      - `--revoke`
 - `richmenu`
    - `add`
    - `remove`
    - `list`
    - `default`
    - `link`
    - `unlink`
 - `liff`
    - `add`
    - `remove`
    - `update`
    - `list`
 - `things` (upcoming)

## Installation

```
npm i @intocode-io/line-api-cli -g
```

<img width="414" alt="npm i @intocode-io/line-api-cli -g" src="https://user-images.githubusercontent.com/1315909/64685066-7e4fc380-d4b0-11e9-9c69-11f85fe6dd97.png">

## Project setup with `line` command

Let's start, to initialize project configuration file. Please go to your [LINE Developer Console](https://developers.line.biz/console/) and get Channel ID and Channel secret. If you do not want to issue a short-lived access token later on, you will also need a long-lived access token.

Once you have the information, run `line` command with `init` operation.

```
line init
```

This command will create `.line-api-cli.yml` configuration file containing necessary information for the CLI to handle API request/response for you.

<img width="507" alt="line init" src="https://user-images.githubusercontent.com/1315909/64685306-f28a6700-d4b0-11e9-94cc-dced718b1c9c.png">

### Issue a short-lived access token

Long-lived access token is nice and easy to use for developers but it is not as secured as a short-lived access token.

To issue a short-lived access token, run the following command.

```
line token --issue
```

It will issue a short-lived access token. You can choose whether to replace the token into `.line-api-cli.yml`

<img width="529" alt="line token --issue" src="https://user-images.githubusercontent.com/1315909/64685575-6e84af00-d4b1-11e9-8438-6614e81f3d9d.png">

Do not forget to replace a short-lived. It is recommended to write a script to replace the token monthly.

### Revoke access token

Ok, sometime you may feel insecure after exposing access token somewhere. No problem, you can revoke it with `--revoke` option.

```
line token --revoke
```

## Working with `richmenu` command

It's time to display nice UI menu to your users, or maybe some menu to some specific user(s). You can do those tasks with `richmenu` command.

### Add a rich menu

First you need to prepare a data file and an image file for rich menu. After you have those in your project directory, you can run `richmenu` command with `add` operation to add a rich menu.

```
richmenu add
```

<img width="482" alt="richmenu add" src="https://user-images.githubusercontent.com/1315909/64861793-138ebb80-d65b-11e9-8881-b8aaaf185e93.png">

### List rich menus

Rich menus can be listed with `list` operation.

```
richmenu list
```

<img width="612" alt="richmenu list" src="https://user-images.githubusercontent.com/1315909/64861824-31f4b700-d65b-11e9-8367-2c782bb8c4c4.png">

### Remove a rich menu

Get bored of old rich menu? You can remove a rich menu with `remove` operation.

```
richmenu remove
```

Then choose a rich menu to be removed.

<img width="480" alt="richmenu remove" src="https://user-images.githubusercontent.com/1315909/64874774-ef8ca380-d675-11e9-8e53-ac6e334f64b8.gif">

### Set a rich menu as default

If you'd like to set a rich menu as default for all users, run the following command.

```
richmenu default
```

### Link a rich menu to a user

Rich menu can be linked to a specific user. For example, if you want a rich menu assigned only to LINE user with Administrator role. You can get a user ID and link a rich menu for the user with this command.

```
richmenu link
```

### Unlink a rich menu from a user

Rich menu can be unlinked from a specific user using `unlink` operation.

```
richmenu unlink
```

## Working with LIFF app using `liff` command

To develop more advanced LINE Bot, LIFF app may required. You can use `liff` command to manage LIFF apps.

### Add a LIFF app

```
liff add
```

<img width="640" alt="liff add" src="https://user-images.githubusercontent.com/1315909/64910629-a3f3fb80-d742-11e9-94a7-600d5db096e2.gif">

### List LIFF apps

```
liff list
```

### Remove a LIFF app

```
liff remove
```

### Update a LIFF app

```
liff update
```

## Working with LINE Things using `things` command

### List all LINE Things trial products

```
things list:trial
```

### Add a trial product

```
things add:trial
```

### Remove a trial product

```
things remove:trial
```

### Get device information by device ID and user ID

```
things get:device
```

### Specify the device ID, and acquire the product ID and PSDI

```
things get:product
```

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

## MIT License

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
