The following page lists **BREAKING CHANGES** between versions `2.x` and `3.x` of the library alongside any possible ways of migration.

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
