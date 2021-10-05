# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/fluxprotocol/oracle-exporer-api/compare/v1.2.0...v1.2.1) (2021-10-05)


### Bug Fixes

* **account:** Fix issue where slashes times was not correct ([80c7ffd](https://github.com/fluxprotocol/oracle-exporer-api/commit/80c7ffd519e9b228f695b69fe07fe347b698cabc))
* **account:** Fix issue where values doubled ([3ed5203](https://github.com/fluxprotocol/oracle-exporer-api/commit/3ed5203ab1721e68c256d5cde1229b0955855642))
* **claims:** Fix issue where claims where missing ([7e29b2c](https://github.com/fluxprotocol/oracle-exporer-api/commit/7e29b2c7486b0affa432702d22d2069deffa8a26))

## [1.2.0](https://github.com/fluxprotocol/oracle-exporer-api/compare/v1.1.0...v1.2.0) (2021-09-28)


### Features

* **scheme:** Add new Analytics scheme ([2cdc933](https://github.com/fluxprotocol/oracle-exporer-api/commit/2cdc933b6e51f5d941f403571f109ed9de38e4f2))


### Bug Fixes

* **account:** Fix issue where slashed data was inaccurate ([3d75123](https://github.com/fluxprotocol/oracle-exporer-api/commit/3d75123b893182e7d2c22d308c191412fcd5156e))

## 1.1.0 (2021-09-21)


### Features

* Add account data and stake data ([0aba949](https://github.com/fluxprotocol/oracle-exporer-api/commit/0aba949292b4f45e9b7cff25329d249863204196))
* Add claim to a user stake ([1a2b001](https://github.com/fluxprotocol/oracle-exporer-api/commit/1a2b0017d21326f1619144750aadfa87baebae03))
* Add cursor based lookups ([54da594](https://github.com/fluxprotocol/oracle-exporer-api/commit/54da5948075f5ba4cc794cd8ae741042a7880448))
* Add description property ([e39cee8](https://github.com/fluxprotocol/oracle-exporer-api/commit/e39cee8c93f389b3fc783e79edc9150f0d90cd75))
* Add fee configuration ([17a8374](https://github.com/fluxprotocol/oracle-exporer-api/commit/17a8374d3b82074122f3fe85c7cf7c0c8385d4f8))
* Add outcome stakes to resolution window ([dcad3c7](https://github.com/fluxprotocol/oracle-exporer-api/commit/dcad3c7f7de9d32d95bebf52b60d6223434572fc))
* Add paid_fee ([77536b6](https://github.com/fluxprotocol/oracle-exporer-api/commit/77536b6a87bfa012ca97ee3fd44bf7ae9ff0ba76))
* Add small temp proxy ([b35e489](https://github.com/fluxprotocol/oracle-exporer-api/commit/b35e4898a12b90f063d7a310fd58ef9d38f8d9ba))
* Add support for new number/string answer types ([11c65fc](https://github.com/fluxprotocol/oracle-exporer-api/commit/11c65fcbdd8efaa91f5e9e12308cc7005280112f))
* Add support for non api request filtering ([e6c52f7](https://github.com/fluxprotocol/oracle-exporer-api/commit/e6c52f7f5e5aa08f2128211c916d4d65f23bd489))
* Add support for oracle config quering ([b2e02e1](https://github.com/fluxprotocol/oracle-exporer-api/commit/b2e02e1e5f59c8de78d54df7b67738895119e09a))
* Add support for querying tags and retrieving them ([2f26423](https://github.com/fluxprotocol/oracle-exporer-api/commit/2f264232d0e18914e916c4dfa45222fcc6445e38))
* Add support for showing unbonded stakes in claimed ([7a56543](https://github.com/fluxprotocol/oracle-exporer-api/commit/7a56543e7ae46eb2ee00434d6ddbd9ca8904f0f4))
* Add support for whitelist in accounts ([4aab52c](https://github.com/fluxprotocol/oracle-exporer-api/commit/4aab52c2ea6aed60d2c846930879dcf31737766c))
* Add unclaimed view ([91282c9](https://github.com/fluxprotocol/oracle-exporer-api/commit/91282c981f187c31d88048ce0b595efa57116173))
* Add user stakes resolver and outcome conversion ([c192267](https://github.com/fluxprotocol/oracle-exporer-api/commit/c192267806eb63f7df4f3c2111ad675ab4e20658))
* Added all models ([a7e0e67](https://github.com/fluxprotocol/oracle-exporer-api/commit/a7e0e673db1050ad6a35a819d3334d2fd4a0e2bc))
* Convert outcomes to a single string ([6456c14](https://github.com/fluxprotocol/oracle-exporer-api/commit/6456c14dcee6c58a75e0d28d700d6c659dbf9b95))
* **dataRequest:** Add account_stakes to model ([462cda0](https://github.com/fluxprotocol/oracle-exporer-api/commit/462cda08770c1f85b4ff8bbe96d854f04c886faf))
* **dataRequest:** Add correct/incorrect staked ([471aea3](https://github.com/fluxprotocol/oracle-exporer-api/commit/471aea344ff9f2b350d11332879776fcd574a1d7))
* **DataRequest:** Add data_type property ([434ecba](https://github.com/fluxprotocol/oracle-exporer-api/commit/434ecba6662772e795c7b56947aa5874461d3348))
* **dataRequest:** Add support for claims ([d6ac3eb](https://github.com/fluxprotocol/oracle-exporer-api/commit/d6ac3eb19919ac3691d80195e05c5f3cc887ad4b))
* npm i graphql ([b5321a9](https://github.com/fluxprotocol/oracle-exporer-api/commit/b5321a92e1d1738eb27b1babb0136c3f1342b61c))
* Replaced contract_entry with account_id ([49352f6](https://github.com/fluxprotocol/oracle-exporer-api/commit/49352f615945df3410a3fb35271f165eeb92461e))
* **unclaimed:** Include unbonded stake ([78b6421](https://github.com/fluxprotocol/oracle-exporer-api/commit/78b64216c143011a6fb4761fd80111bf4961df6f))


### Bug Fixes

* Fix issue where bond_token was used instead of payment_token ([486c0ae](https://github.com/fluxprotocol/oracle-exporer-api/commit/486c0ae9570ba52e3f3f41817056ea5875dd7e03))
* Fix issue where cursor would not always correctly return the next data request ([1e9d65d](https://github.com/fluxprotocol/oracle-exporer-api/commit/1e9d65d905f429101eec2e373c8a3a1b540ee138))
* **requests:** Fix issue where account_id could not be joined for whitelists ([4e7f466](https://github.com/fluxprotocol/oracle-exporer-api/commit/4e7f466858eb5f59b15ed97d429f3e9b78c49978))
