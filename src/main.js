// @ts-check

import fetch from 'node-fetch'

/**
 * @private
 * @ignore
 *
 * @typedef {Object} ParamParser
 * @property {unknown} d
 * @property {function(unknown): string} v
 */

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
    const { ids, titles, abstract } = this._parseParams(request, {
      ids: this._paramParser([], 'number', true),
      titles: this._paramParser([], 'string', true),
      abstract: this._paramParser(100, 'number'),
    })
    if (ids === '' && titles === '') throw new Error('Argument ids or titles should be passed!')
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
    const { category, namespaces, limit, offset } = this._parseParams(request, {
      category: this._paramParser('', 'string'),
      namespaces: this._paramParser([], 'number', true),
      limit: this._paramParser(25, 'number'),
      offset: this._paramParser('', 'string'),
    })
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
    const { namespaces, category, limit } = this._parseParams(request, {
      namespaces: this._paramParser([], 'number', true),
      category: this._paramParser('', 'string'),
      limit: this._paramParser(10, 'number'),
    })
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
    const params = this._parseParams({ query }, { query: this._paramParser(undefined, 'string') })
    return /** @type {Promise<SearchSuggestionsRes>} */ (
      this._makeRequest('SearchSuggestions/List', { query: params.query })
    )
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
    const { ids, size } = this._parseParams(request, {
      ids: this._paramParser([], 'number', true),
      size: this._paramParser(100, 'number'),
    })
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
   * @param {Object<string, string>} [params]
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
   * @param {unknown} defaultValue
   * @param {"number" | "string"} requiredType
   * @param {boolean} [canBeArray=false]
   * @returns {ParamParser}
   */
  _paramParser(defaultValue, requiredType, canBeArray = false) {
    return {
      d: defaultValue,
      v: input => {
        if (typeof input === requiredType) return /** @type {number | string} */ (input).toString()

        if (canBeArray && Array.isArray(input) && input.every(x => typeof x === requiredType)) return input.join(',')

        throw new Error(`Given input (${input}) has invalid type!`)
      },
    }
  }

  /**
   * @private
   * @ignore
   *
   * @param {Object<string, unknown>} options
   * @param {Object<string, ParamParser>} optionParsers
   * @returns {Object<string, string>}
   */
  _parseParams(options, optionParsers) {
    const defaultOptions = Object.fromEntries(Object.entries(optionParsers).map(([p, { d }]) => [p, d]))
    const optionsWithDefaults = Object.assign({}, defaultOptions, options)
    const parsedOptions = /** @type {Object<string, string>} */ ({})

    for (const paramName in optionsWithDefaults) {
      if (optionsWithDefaults[paramName] === undefined) continue
      if (!(paramName in optionParsers)) throw new Error(`Unexpected param (${paramName}) given!`)
      parsedOptions[paramName] = optionParsers[paramName].v(optionsWithDefaults[paramName])
    }

    return parsedOptions
  }
}

export default WikiaAPI
