# Changelog

## [1.3.x]
### Added
 - `linetv list:modules` Gets a spotlight data unit list such as represent_clip, editor_pick_clip, and theme_playlist. 

## [1.2.0]
### Added
 - `things register:scenario-set` Register (create or update) a scenario set for automatic communication under a product.
 - `things get:scenario-set` Get the scenario set registered under a product
 - `things remove:scenario-set` Delete a scenario set registered under a product

## [1.1.0]
### Added
 - `things list:trial`
 - `things add:trial`
 - `things remove:trial`
 - `things get:device` Get device information by device ID and user ID
 - `things get:product` Specify the device ID, and acquire the product ID and PSDI
 - `things get:devices` Specify the product ID and user ID, and acquire the device information

## [1.0.0]
### Added
 - `liff remove`
 - `liff update`

## [0.7.0]
### Added
 - `liff add`
 - `liff list`

## [0.6.0]
### Added
 - `richmenu link`
 - `richmenu unlink`
### Changed
 - Re-arrange columns in `richmenu list` and add `name` column
 - Update dependencies

## [0.5.0]
### Added
 - `richmenu default`

## [0.4.0]
### Added
 - `richmenu remove`

## [0.3.1]
### Fixed
 - Fixed missing `richmenu` CLI

## [0.3.0]
### Added
 - `richmenu list`

## [0.2.0]
### Added
 - `line token --revoke`
 - `richmenu add`

## [0.1.0]
### Added
 - `line init` can generate configuration file with channel id, secret, and accessToken
 - `line init` asks whether to overwrite current configuration file if it already exists
 - `line token --issue`
