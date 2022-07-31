// @ts-check

/**
 * @typedef {Object} ArticleDetailsReq
 * @property {(number[]|number)} [ids] An array of article ids or a single article id
 * @property {(string[]|string)} [titles] An array of article titles or a single article title, can be used alongside ids
 * @property {number} [abstract=100] The desired length for the article's abstract
 *
 * @see {@link WikiaAPI#getArticleDetails}
 */

/**
 * @typedef {Object} ArticleListReq
 * @property {string} [category] Return only articles belonging to the provided valid category title
 * @property {(number[]|number)} [namespaces=0] Array of namespace ids or a single namespace id, see: {@link http://community.fandom.com/wiki/Help:Namespaces Help:Namespaces}
 * @property {number} [limit=25] Limit the number of results
 * @property {string} [offset="!"] Only display articles where name is lexicographically greater than provided
 *
 * @see {@link WikiaAPI#getArticleList}
 */

/**
 * @typedef {Object} TopArticlesReq
 * @property {(number[]|number)} [namespaces] Array of namespace ids or a single namespace id, see: {@link http://community.wikia.com/wiki/Help:Namespaces Help:Namespaces}
 * @property {string} [category] Return only articles belonging to the provided category title
 * @property {number} [limit=10] Limit the number of results - maximum limit is 250
 *
 * @see {@link WikiaAPI#getTopArticles}
 */

/**
 * @typedef {Object} UserDetailsReq
 * @property {(number[]|number)} ids An array of user ids or a single user id
 * @property {number} [size=100] The desired width and height of the thumbnail, defaults to 100, 0 for no thumbnail
 *
 * @see {@link WikiaAPI#getUserDetails}
 */
