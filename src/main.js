// @ts-check

import fetch from 'node-fetch'

/**
 * Object wrapping a particular wiki's Wikia API V1.
 *
 * @tutorial getting-started
 * @tutorial endpoints
 * @tutorial migration-guide
 */
class WikiaAPI {
  /**
   * @param {string} subdomain Subdomain, for example "dev" for "dev.fandom.com"
   * @param {string} [language] Optional language code, for example "pl" for "leagueoflegends.fandom.com/pl"
   */
  constructor(subdomain, language) {
    /**
     * Subdomain, for example "dev" for "dev.fandom.com".
     * @type {string}
     */
    this.subdomain = subdomain

    /**
     * Language code, for example "pl" for "leagueoflegends.fandom.com/pl".
     * @type {string | null}
     */
    this.language = language ?? null
  }

  /**
   * Get details about one or more articles.
   *
   * @param {ArticleDetailsReq} request Request parameters
   * @returns {Promise<ArticleDetailsRes>}
   *
   * @see {@link ArticleDetailsReq}
   * @see {@link ArticleDetailsRes}
   */
  getArticleDetails(request) {
    const params = this._parseParams(
      request,
      { ids: [], titles: [], abstract: 100 },
      {
        ids: x => typeof x === 'number' || Array.isArray(x),
        titles: x => typeof x === 'string' || Array.isArray(x),
        abstract: 'number',
      }
    )
    const ids = this._arrayOrSingleElement(params.ids)
    const titles = this._arrayOrSingleElement(params.titles, 'string')
    const abstract = /** @type {number} */ (params.abstract)
    if (ids === '' && titles === '') throw new Error("Argument 'ids' or 'titles' should be passed")
    return /** @type {Promise<ArticleDetailsRes>} */ (this._makeRequest('Articles/Details', { ids, titles, abstract }))
  }

  /**
   * Get article list in alphabetical order.
   *
   * @param {ArticleListReq} [request] Optional request parameters
   * @returns {Promise<ArticleListRes>}
   *
   * @see {@link ArticleListReq}
   * @see {@link ArticleListRes}
   */
  getArticleList(request = {}) {
    const params = this._parseParams(
      request,
      { category: '', namespaces: 0, limit: 25, offset: '!' },
      {
        category: 'string',
        namespaces: x => typeof x === 'number' || Array.isArray(x),
        limit: 'number',
        offset: 'string',
      }
    )
    const category = /** @type {string} */ (params.category)
    const namespaces = this._arrayOrSingleElement(params.namespaces)
    const limit = /** @type {number} */ (params.limit)
    const offset = /** @type {string} */ (params.offset)
    return /** @type {Promise<ArticleListRes>} */ (
      this._makeRequest('Articles/List', { category, namespaces, limit, offset })
    )
  }

  /**
   * Get the most viewed articles from this wiki.
   *
   * @param {TopArticlesReq} [request] Optional request parameters
   * @returns {Promise<TopArticlesRes>}
   *
   * @see {@link TopArticlesReq}
   * @see {@link TopArticlesRes}
   */
  getTopArticles(request = {}) {
    const params = this._parseParams(
      request,
      { namespaces: [], category: '', limit: 10 },
      {
        namespaces: x => typeof x === 'number' || Array.isArray(x),
        category: 'string',
        limit: 'number',
      }
    )
    const namespaces = this._arrayOrSingleElement(params.namespaces)
    const category = /** @type {string} */ (params.category)
    const limit = /** @type {number} */ (params.number)
    return /** @type {Promise<TopArticlesRes>} */ (this._makeRequest('Articles/Top', { namespaces, category, limit }))
  }

  /**
   * Get wiki data, including key values, navigation data and more.
   *
   * @returns {Promise<WikiVariablesRes>}
   *
   * @see {@link WikiVariablesRes}
   */
  getWikiVariables() {
    return /** @type {Promise<WikiVariablesRes>} */ (this._makeRequest('Mercury/WikiVariables'))
  }

  /**
   * Find suggested phrases for chosen query.
   *
   * @param {string} query Search query
   * @returns {Promise<SearchSuggestionsRes>}
   *
   * @see {@link SearchSuggestionsRes}
   */
  getSearchSuggestions(query) {
    const params = this._parseParams({ query }, {}, { query: 'string' })
    const q = /** @type {string} */ (params.query)
    return /** @type {Promise<SearchSuggestionsRes>} */ (this._makeRequest('SearchSuggestions/List', { query: q }))
  }

  /**
   * Get details about selected users.
   *
   * @param {UserDetailsReq} request Request parameters
   * @returns {Promise<UserDetailsRes>}
   *
   * @see {@link UserDetailsReq}
   * @see {@link UserDetailsRes}
   */
  getUserDetails(request) {
    const params = this._parseParams(
      request,
      { size: 100 },
      {
        ids: x => typeof x === 'number' || Array.isArray(x),
        size: 'number',
      }
    )
    const ids = this._arrayOrSingleElement(params.ids)
    const size = /** @type {number} */ (params.size)
    return /** @type {Promise<UserDetailsRes>} */ (this._makeRequest('User/Details', { ids, size }))
  }

  /**
   * Basepath of Wikia API V1 for the given subdomain and language, for example "http://dev.fandom.com/api/v1/".
   * @type {string}
   * @readonly
   */
  get apiBasepath() {
    return `https://${this.subdomain}.fandom.com/${this.language ? `${this.language}/` : ''}api/v1/`
  }

  /**
   * @private
   * @ignore
   *
   * @param {string} endpoint
   * @param {Object.<string, string | number>} [params]
   * @returns {Promise<unknown>}
   */
  async _makeRequest(endpoint, params) {
    const query = Object.entries(params ?? {})
      .filter(([, value]) => value !== '' && value !== undefined)
      .map(([param, value]) => `${param}=${encodeURIComponent(value).replace(/%7C/g, '|')}`)
      .join('&')

    const response = await fetch(`${this.apiBasepath}${endpoint}?${query}`)
    const data = await response.json()
    return data
  }

  /**
   * @private
   * @ignore
   *
   * @param {number | number[] | string | string[]} input
   * @param {"number" | "string"} inputType
   * @returns {string}
   */
  _arrayOrSingleElement(input, inputType = 'number') {
    /** @type {string} */
    let output
    if (Array.isArray(input)) {
      output = input.join(',')
    } else if (typeof input === inputType) {
      output = input.toString()
    } else {
      throw new Error(
        `Incorrect argument type. Expected ${inputType} or array of ${inputType}s, got ${typeof input} instead`
      )
    }
    return output
  }

  /**
   * @private
   * @ignore
   *
   * @param {Object.<string, string | string[] | number | number[]>} options
   * @param {Object.<string, string | string[] | number | number[]>} defaultOptions
   * @param {Object.<string, "string" | "number" | function(any): boolean>} optionTypes
   * @returns {Object.<string, string | string[] | number | number[]>}
   */
  _parseParams(options, defaultOptions, optionTypes) {
    let newOptions
    newOptions = Object.assign({}, defaultOptions, options)
    for (let opt in optionTypes) {
      const type = optionTypes[opt]
      if (typeof type === 'string') {
        if (typeof newOptions[opt] !== type) {
          throw new Error(`Bad argument type. Expected ${opt} to be a ${type}, found ${typeof newOptions[opt]} instead`)
        }
      } else {
        if (!type(newOptions[opt])) {
          throw new Error(`Bad argument type for ${opt}`)
        }
      }
    }
    return newOptions
  }
}

export default WikiaAPI
