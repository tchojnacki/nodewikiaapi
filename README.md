# nodewikiaapi
JavaScript wrapper for the (no longer supported) Fandom's **Wikia API V1**.

## ⚠️ DEPRECATED ⚠️
### Deprecation notice
This library will get no new feature updates, only serious and common-case bugs will be fixed. It is not recommended to use this library (or the Wikia API V1 itself) for fresh projects any longer, however, I am keeping it online to make sure that all of the current users can keep depending on it.

### Why?
The Wikia API V1 [lost its documentation](https://community.fandom.com/f/p/4400000000001906655) following the [UCP update](https://community.fandom.com/wiki/Help:Unified_Community_Platform). Some of the endpoints disappeared without notice throughout the years and, generally, it seems that this API is no longer supported. Thus any of the wrapper library's methods could stop working at any time.

## About
### Features
- All of the (still functional) endpoints covered and fully documented
- Strong typing for request and response objects (through [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html))
- Rate limiting to avoid flooding the server
- All endpoints covered by tests (100% code coverage)

### Documentation
The documentation is available on [Github Pages](https://tchojnacki.github.io/nodewikiaapi/).

See also:
* [Getting started tutorial](https://tchojnacki.github.io/nodewikiaapi/tutorial-getting-started.html)
* [Migration guide (3.x)](https://tchojnacki.github.io/nodewikiaapi/tutorial-migration-guide.html)
* [List of available endpoints](https://tchojnacki.github.io/nodewikiaapi/tutorial-endpoints.html)
* [This package in the npm registry](https://www.npmjs.com/package/nodewikiaapi)

### Legal info
Text content accessed through the API is made available under the [Creative Commons Attribution-Share Alike License 3.0](https://www.fandom.com/licensing). Wikia is a registered trademark of [Fandom, Inc.](https://www.fandom.com/terms-of-use) (formerly known as Wikia, Inc.). This library isn't endorsed by Fandom, Inc. and doesn't reflect the views or opinions of the company.
