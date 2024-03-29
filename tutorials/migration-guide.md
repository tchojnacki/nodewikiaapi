The following page lists **BREAKING CHANGES** between versions `2.x` and `3.x` of the library alongside any possible workarounds.

If any of the changes make you unable to use the library, you can install version `2.x` which had all of the security vulnerabilities patched as of the day of the release of version `3.0.0`.

### Importing
The library is now exported as ESM instead of CJS. See more information [here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#file-esm-package-md).

### Removed endpoints
These endpoints were removed following the UCP, with no information on whether they will be made available again in the future. Thus they were also removed from the wrapper library. You should no longer depend on those methods.

- `Activity`
  - `LatestActivity` (`getLatestActivity()`)
  - `RecentlyChangedArticles` (`getRecentlyChangedArticles()`)
- `Articles`
  - `AsSimpleJson` (`getArticleAsSimpleJson()`)
  - `MostLinked` (`getMostLinked()`)
  - `MostLinked?expand=1` (`getMostLinkedExpanded()`)
  - `New` (`getNewArticles()`)
  - `Popular` (`getPopularArticles()`)
  - `Popular?expand=1` (`getPopularArticlesExpanded()`)
  - `List?expand=1` (`getArticlesListExpanded()`)
  - `Top?expand=1` (`getTopArticlesExpanded()`)
- `Navigation`
  - `Data` (`getNavigationData()`)
- `RelatedPages`
  - `List` (`getRelatedPages()`)
- `Search`
  - `List` (`getSearchList()`)

### Removed members
- `WikiaAPI.wikiaapiurl` static member has been removed as the `subdomain` is now required
- `WikiaAPI.wikiurl` instance member has been removed as the `subdomain` is now required
- `WikiaAPI.wikiaurl` static member has been removed as the `subdomain` is now required

### Renames
- `WikiaAPI.wikiapiurl` is now called [`WikiaAPI.apiBasepath`](WikiaAPI.html#apiBasepath)
- `WikiaAPI.getArticlesDetails()` is now called [`WikiaAPI.getArticleDetails()`](WikiaAPI.html#getArticleDetails)
- `WikiaAPI.getArticlesList()` is now called [`WikiaAPI.getArticleList()`](WikiaAPI.html#getArticleList)

### Parameter changes
- [`WikiaAPI`](WikiaAPI.html)'s constructor `subdomain` param is now required
- [`WikiaAPI.getArticleDetails()`](WikiaAPI.html#getArticleDetails)'s options object:
  - is now required
  - no longer contains `width` and `height`
- [`WikiaAPI.getTopArticles()`](WikiaAPI.html#getTopArticles)'s options object:
  - no longer contains `baseArticleId`
  - no longer takes `null` as a valid `namespaces` value
- [`WikiaAPI.getSearchSuggestions()`](WikiaAPI.html#getSearchSuggestions) now takes a string as its only parameter (instead of an object containing a singular string value)
- [`WikiaAPI.getUserDetails()`](WikiaAPI.html#getUserDetails)'s options object:
  - is now required
  - now must contain the `ids` property

### Other changes
- [`WikiaAPI.apiBasepath`](WikiaAPI.html#apiBasepath) (formerly `wikiapiurl`) now:
  - returns an extra trailing slash
  - uses `https://` instead of `http://`
  - uses `fandom.com` instead of `wikia.com`
- `WikiaAPI`'s methods starting with an underscore are now marked as `@private`, their use was never recommended or documented, but it is now prohibited by TypeScript
- The underlying HTTP client is now [`fetch`](https://www.npmjs.com/package/node-fetch) instead of `got`
- The API is now limited to maximally two concurrent data connections at any point in time
