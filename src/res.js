// @ts-check

/**
 * @typedef {Object} ArticleDetailsResItemRevision
 * @property {number} id
 * @property {string} user
 * @property {number} user_id
 * @property {string} timestamp
 */

/**
 * @typedef {Object} ArticleDetailsResItem
 * @property {number} id
 * @property {string} title
 * @property {number} ns
 * @property {string} url
 * @property {ArticleDetailsResItemRevision} revision
 * @property {string} type
 * @property {string} abstract
 */

/**
 * @typedef {Object} ArticleDetailsRes
 * @property {Object.<number, ArticleDetailsResItem>} items
 * @property {string} basepath
 *
 * @see {@link WikiaAPI#getArticleDetails}
 */

/**
 * @typedef {Object} ArticleItem
 * @property {number} id
 * @property {string} title
 * @property {string} url
 * @property {number} ns
 */

/**
 * @typedef {Object} ArticleListRes
 * @property {ArticleItem[]} items
 * @property {string} basepath
 * @property {string} offset
 * @see {@link WikiaAPI#getArticleList}
 */

/**
 * @typedef {Object} TopArticlesRes
 * @property {ArticleItem[]} items
 * @property {string} basepath
 * @see {@link WikiaAPI#getTopArticles}
 */

/**
 * @typedef {Object} WikiVariablesResDataAppleTouchIcon
 * @property {string} url
 * @property {string} size
 */

/**
 * @typedef {Object} WikiVariablesResDataHtmlTitle
 * @property {string} separator
 * @property {string[]} parts
 */

/**
 * @typedef {Object} WikiVariablesResDataLanguage
 * @property {string} content
 * @property {"ltr"|"rtl"} contentDir
 */

/**
 * @typedef {Object} WikiVariablesResData
 * @property {string} vertical
 * @property {WikiVariablesResDataAppleTouchIcon} appleTouchIcon
 * @property {string} articlePath
 * @property {string} basePath
 * @property {string} dbName
 * @property {string} favicon
 * @property {number} id
 * @property {boolean} isClosed
 * @property {WikiVariablesResDataHtmlTitle} htmlTitle
 * @property {WikiVariablesResDataLanguage} language
 * @property {string} scriptPath
 * @property {string} siteName
 * @property {string} surrogateKey
 * @property {boolean} enableCommunityData
 * @property {string} mainPageTitle
 * @property {string} siteMessage
 * @property {string} cookieDomain
 */

/**
 * @typedef {Object} WikiVariablesRes
 * @property {WikiVariablesResData} data
 * @see {@link WikiaAPI#getWikiVariables}
 */

/**
 * @typedef {Object} SearchSuggestionsResItem
 * @property {string} title
 */

/**
 * @typedef {Object} SearchSuggestionsRes
 * @property {SearchSuggestionsResItem[]} items
 * @see {@link WikiaAPI#getSearchSuggestions}
 */

/**
 * @typedef {Object} UserDetailsResItem
 * @property {number} user_id
 * @property {string} title
 * @property {string} name
 * @property {string} url
 * @property {number} numberofedits
 * @property {boolean} is_subject_to_ccpa
 * @property {string} avatar
 */

/**
 * @typedef {Object} UserDetailsRes
 * @property {UserDetailsResItem} items
 * @property {string} basepath
 * @see {@link WikiaAPI#getUserDetails}
 */
