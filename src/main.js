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
    const params = this._parseParams(request, {
      ids: this._paramParser([], 'number', true),
      titles: this._paramParser([], 'string', true),
      abstract: this._paramParser(100, 'number'),
    })
    if (!(params.has('ids') || params.has('titles'))) throw new Error('Argument ids or titles should be passed!')
    return /** @type {Promise<ArticleDetailsRes>} */ (this._makeRequest('Articles/Details', params))
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
    const params = this._parseParams(request, {
      category: this._paramParser('', 'string'),
      namespaces: this._paramParser([], 'number', true),
      limit: this._paramParser(25, 'number'),
      offset: this._paramParser('', 'string'),
    })
    return /** @type {Promise<ArticleListRes>} */ (this._makeRequest('Articles/List', params))
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
    const params = this._parseParams(request, {
      namespaces: this._paramParser([], 'number', true),
      category: this._paramParser('', 'string'),
      limit: this._paramParser(10, 'number'),
    })
    return /** @type {Promise<TopArticlesRes>} */ (this._makeRequest('Articles/Top', params))
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
    return /** @type {Promise<SearchSuggestionsRes>} */ (this._makeRequest('SearchSuggestions/List', params))
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
    const params = this._parseParams(request, {
      ids: this._paramParser([], 'number', true),
      size: this._paramParser(100, 'number'),
    })
    return /** @type {Promise<UserDetailsRes>} */ (this._makeRequest('User/Details', params))
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
   * @param {URLSearchParams} [params]
   * @returns {Promise<unknown>}
   */
  async _makeRequest(endpoint, params) {
    const query = params ? `?${params.toString()}` : ''
    const response = await fetch(`${this.apiBasepath}${endpoint}${query}`)
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
   * @returns {URLSearchParams}
   */
  _parseParams(options, optionParsers) {
    const defaultOptions = Object.fromEntries(Object.entries(optionParsers).map(([p, { d }]) => [p, d]))
    const optionsWithDefaults = Object.assign({}, defaultOptions, options)
    const parsedOptions = new URLSearchParams()

    for (const paramName in optionsWithDefaults) {
      if (optionsWithDefaults[paramName] === undefined) continue
      if (!(paramName in optionParsers)) throw new Error(`Unexpected param (${paramName}) given!`)
      const paramValue = optionParsers[paramName].v(optionsWithDefaults[paramName])
      if (paramValue === '') continue
      parsedOptions.append(paramName, encodeURIComponent(paramValue).replace(/%7C/g, '|'))
    }

    return parsedOptions
  }
}

export default WikiaAPI
