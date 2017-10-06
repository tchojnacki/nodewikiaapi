# Endpoints
List of currently available endpoints.
## Wikia API V1
[Wikia API V1](http://dev.wikia.com/api/v1) endpoints for a given wiki.
* [`Activity`](http://dev.wikia.com/api/v1#!/Activity)
  * `LatestActivity` - [`getLatestActivity()`](WikiaAPI.html#getLatestActivity)
  * `RecentlyChangedArticles` - [`getRecentlyChangedArticles()`](WikiaAPI.html#getRecentlyChangedArticles)
* [`Articles`](http://dev.wikia.com/api/v1#!/Articles)
  * `AsSimpleJson` - [`getArticleAsSimpleJson()`](WikiaAPI.html#getArticleAsSimpleJson)
  * `Details` - [`getArticlesDetails()`](WikiaAPI.html#getArticlesDetails)
  * `List` - [`getArticlesList()`](WikiaAPI.html#getArticlesList)
  * `List?expand=1` - [`getArticlesListExpanded()`](WikiaAPI.html#getArticlesListExpanded)
  * `MostLinked` - [`getMostLinked()`](WikiaAPI.html#getMostLinked)
  * `MostLinked?expand=1` - [`getMostLinkedExpanded()`](WikiaAPI.html#getMostLinkedExpanded)
  * `New` - [`getNewArticles()`](WikiaAPI.html#getNewArticles)
  * `Popular` - [`getPopularArticles()`](WikiaAPI.html#getPopularArticles)
  * `Popular?expand=1` - [`getPopularArticlesExpanded()`](WikiaAPI.html#getPopularArticlesExpanded)
  * `Top` - [`getTopArticles()`](WikiaAPI.html#getTopArticles)
  * `Top?expand=1` - [`getTopArticlesExpanded()`](WikiaAPI.html#getTopArticlesExpanded)
* [`Mercury`](http://dev.wikia.com/api/v1#!/Mercury)
  * `WikiVariables`
* [`Navigation`](http://dev.wikia.com/api/v1#!/Navigation)
  * `Data`
* [`RelatedPages`](http://dev.wikia.com/api/v1#!/RelatedPages)
  * `List`
* [`Search`](http://dev.wikia.com/api/v1#!/Search)
  * `List`
* [`SearchSuggestions`](http://dev.wikia.com/api/v1#!/SearchSuggestions)
  * `List`
* [`User`](http://dev.wikia.com/api/v1#!/User)
  * `Details`

## Wikia API V1 Global
[Wikia API V1](http://www.wikia.com/api/v1) endpoints for `wikia.com`. Note that you can use most of local endpoints directly on `wikia.com` by providing no subdomain to the constructor.
* [`Articles`](http://wikia.com/api/v1#!/Activity)
  * `TopByHub`
* [`Search`](http://www.wikia.com/api/v1#!/Search)
  * `CrossWiki`
  * `CrossWiki?expand=1`
* [`WAM`](http://www.wikia.com/api/v1#!/WAM)
  * `MinMaxWamIndexDate`
  * `WAMIndex`
  * `WAMLanguages`
* [`Wikis`](http://www.wikia.com/api/v1#!/Wikis)
  * `ByString`
  * `ByString?expand=1`
  * `Details`
  * `List`
  * `List?expand=1`

## MW API
[MediaWiki API](http://dev.wikia.com/api.php) endpoints for a given wiki.