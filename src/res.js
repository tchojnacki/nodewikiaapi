// @ts-check

/**
 * @typedef {Object} ArticleDetailsResItemRevision
 * @property {number} id Internal revision identifier
 * @property {string} user Username of associated editor
 * @property {number} user_id Identifier of associated editor
 * @property {string} timestamp Time of the revision
 */

/**
 * @typedef {Object} ArticleDetailsResItem
 * @property {number} id Internal article identifier
 * @property {string} title Article's title
 * @property {number} ns Article's namespace, see: see: {@link http://community.wikia.com/wiki/Help:Namespaces Help:Namespaces}
 * @property {string} url Article's URL
 * @property {ArticleDetailsResItemRevision} revision Last revision of the article
 * @property {string} type Type of the page ("article" for articles)
 * @property {string} abstract Short description of the article
 */

/**
 * @typedef {Object} ArticleDetailsRes
 * @property {Object<number, ArticleDetailsResItem>} items Dictionary mapping article ids to objects describing them
 * @property {string} basepath URL of associated wiki
 *
 * @see {@link WikiaAPI#getArticleDetails}
 */

/**
 * @typedef {Object} ArticleItem
 * @property {number} id Internal article identifier
 * @property {string} title Article's title
 * @property {string} url Article's URL
 * @property {number} ns Article's namespace, see: see: {@link http://community.wikia.com/wiki/Help:Namespaces Help:Namespaces}
 */

/**
 * @typedef {Object} ArticleListRes
 * @property {ArticleItem[]} items Array of article items
 * @property {string} basepath URL of associated wiki
 * @property {string} offset Current lexicographical offset (lists first articles where titles are greater lexicographically than that offset)
 *
 * @see {@link WikiaAPI#getArticleList}
 */

/**
 * @typedef {Object} TopArticlesRes
 * @property {ArticleItem[]} items Array of article items
 * @property {string} basepath URL of associated wiki
 *
 * @see {@link WikiaAPI#getTopArticles}
 */

/**
 * @typedef {Object} WikiVariablesResAppleIcon
 * @property {string} url Icon's URL
 * @property {string} size String describing icon's dimensions
 */

/**
 * @typedef {Object} WikiVariablesResHtmlTitle
 * @property {string} separator Title separator sequence
 * @property {string[]} parts Parts of the title
 */

/**
 * @typedef {Object} WikiVariablesResLanguage
 * @property {string} content Wiki's content language
 * @property {"ltr" | "rtl"} contentDir Direction of text ("ltr" - left to right, "rtl" - right to left)
 */

/**
 * @typedef {Object} WikiVariablesResData
 * @property {string} vertical Primary category of the wiki
 * @property {WikiVariablesResAppleIcon} appleTouchIcon Object describing icon shown on Apple devices
 * @property {string} articlePath Base URL of wiki's articles
 * @property {string} basePath Base URL of the entire site
 * @property {string} dbName Name of related database
 * @property {string} favicon URL of site's favicon, see {@link https://community.fandom.com/wiki/Help:Favicon Help:Favicon}
 * @property {number} id Internal wiki identifier
 * @property {boolean} isClosed Whether the wiki is closed
 * @property {WikiVariablesResHtmlTitle} htmlTitle Object describing how wiki's `<title>` tag is formed
 * @property {WikiVariablesResLanguage} language Object describing wiki's language
 * @property {string} scriptPath Base URL of site's JS scripts
 * @property {string} siteName Main title of the wiki in its full form
 * @property {string} surrogateKey Wiki's identifier in internal databases
 * @property {boolean} enableCommunityData
 * @property {string} mainPageTitle Title of wiki's home/landing article
 * @property {string} siteMessage Full wiki title
 * @property {string} cookieDomain Scope of cookies stored on this wiki
 */

/**
 * @typedef {Object} WikiVariablesRes
 * @property {WikiVariablesResData} data Wrapper object containing all of the other info
 *
 * @see {@link WikiaAPI#getWikiVariables}
 */

/**
 * @typedef {Object} SearchSuggestionsResItem
 * @property {string} title Suggested article's title
 */

/**
 * @typedef {Object} SearchSuggestionsRes
 * @property {SearchSuggestionsResItem[]} items List of suggested articles for a given query
 *
 * @see {@link WikiaAPI#getSearchSuggestions}
 */

/**
 * @typedef {Object} UserDetailsResItem
 * @property {number} user_id Internal user identifier
 * @property {string} title User's title
 * @property {string} name User's name
 * @property {string} url URL of user's profile page
 * @property {number} numberofedits Number of user's edits on the given wiki
 * @property {boolean} is_subject_to_ccpa See: {@link https://oag.ca.gov/privacy/ccpa CCPA}
 * @property {string} avatar Link to user's avatar
 */

/**
 * @typedef {Object} UserDetailsRes
 * @property {UserDetailsResItem} items Array of matching users
 * @property {string} basepath URL of associated wiki
 *
 * @see {@link WikiaAPI#getUserDetails}
 */
