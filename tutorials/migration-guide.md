The following page lists **BREAKING CHANGES** between versions `2.x` and `3.x` of the library alongside any possible workarounds.

## Removed endpoints
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
- `Navigation`
  - `Data` (`getNavigationData()`)
- `RelatedPages`
  - `List` (`getRelatedPages()`)
- `Search`
  - `List` (`getSearchList()`)

## Removed members
- `WikiaAPI.wikiaapiurl` static member has been removed as the `subdomain` is now required
- `WikiaAPI.wikiurl` instance member has been removed as the `subdomain` is now required
- `WikiaAPI.wikiaurl` static member has been removed as the `subdomain` is now required

## Renames
- `WikiaAPI.wikiapiurl` is now called [`WikiaAPI.apiBasepath`](WikiaAPI.html#apiBasepath)

## Parameter changes
- [`WikiaAPI`](WikiaAPI.html)'s constructor `subdomain` param is now required

## Other changes
- [`WikiaAPI.apiBasepath`](WikiaAPI.html#apiBasepath) (formerly `wikiapiurl`) now:
  - returns an extra trailing slash
  - uses `https://` instead of `http://`
  - uses `fandom.com` instead of `wikia.com`
- `WikiaAPI`'s `_makeRequest()`, `_arrayOrSingleElement()`, `_parseParams()` are now marked as `@private`, their use was never recommended or documented, but it is now prohibited by TypeScript
