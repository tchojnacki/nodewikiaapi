// @ts-check

import got from 'got'

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
    const { ids, titles, abstract } = this._parseParams(
      request,
      { ids: -1, titles: '', abstract: 100 },
      {
        ids: x => typeof x === 'number' || Array.isArray(x),
        titles: x => typeof x === 'string' || Array.isArray(x),
        abstract: 'number',
      }
    )
    if (ids === -1 && titles === '') {
      throw new Error("Argument 'ids' or 'titles' should be passed")
    }
    return /** @type {Promise<ArticleDetailsRes>} */ (
      this._makeRequest('Articles/Details', {
        ids: this._arrayOrSingleElement(ids),
        titles: this._arrayOrSingleElement(titles, 'string'),
        abstract,
      })
    )
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
    const { category, namespaces, limit, offset } = this._parseParams(
      request,
      { category: '', namespaces: 0, limit: 25, offset: '!' },
      {
        category: 'string',
        namespaces: x => typeof x === 'number' || Array.isArray(x),
        limit: 'number',
        offset: 'string',
      }
    )
    return /** @type {Promise<ArticleListRes>} */ (
      this._makeRequest('Articles/List', {
        category,
        namespaces: this._arrayOrSingleElement(namespaces),
        limit,
        offset,
      })
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
    const { namespaces, category, limit } = this._parseParams(
      request,
      { namespaces: null, category: '', limit: 10 },
      {
        namespaces: x => typeof x === 'number' || Array.isArray(x) || x === null,
        category: 'string',
        limit: 'number',
      }
    )
    return /** @type {Promise<TopArticlesRes>} */ (
      this._makeRequest('Articles/Top', {
        namespaces: this._arrayOrSingleElement(namespaces),
        category,
        limit,
      })
    )
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
    const { query: q } = this._parseParams({ query }, {}, { query: 'string' })
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
    const { ids, size } = this._parseParams(
      request,
      { size: 100 },
      {
        ids: x => typeof x === 'number' || Array.isArray(x),
        size: 'number',
      }
    )
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
   * @param {Object.<string, string | string[] | number | number[] | null>} [params]
   * @param {"GET"} [method]
   * @returns {Promise<unknown>}
   */
  _makeRequest(endpoint, params, method) {
    return new Promise((resolve, reject) => {
      /** @type {string[]} */
      let query = []
      for (let param in params) {
        const p = /**
         * @ignore
         * @type {string | number | null}
         */ (params[param])
        if (p !== null) {
          query.push(param + '=' + encodeURIComponent(p).replace(/%7C/g, '|'))
        }
      }

      const reqUrl = `${this.apiBasepath}${endpoint}?${query.join('&')}`
      got(reqUrl, { method: method || 'GET' })
        .then(response => {
          /** @type {string} */
          let body
          try {
            body = JSON.parse(response.body)
            resolve(body)
          } catch (error) {
            reject(new Error('Community not found'))
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * @private
   * @ignore
   *
   * @param {number | number[] | string | string[] | null} input
   * @param {"number" | "string"} inputType
   * @returns {string | null}
   */
  _arrayOrSingleElement(input, inputType = 'number') {
    /** @type {string | null} */
    let output
    if (Array.isArray(input)) {
      output = input.join(',')
    } else if (input === null) {
      output = input
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
   * @param {Object.<string, string | string[] | number | number[] | null>} options
   * @param {Object.<string, string | string[] | number | number[] | null>} defaultOptions
   * @param {Object.<string, "string" | "number" | function(any): boolean>} optionTypes
   * @returns {Object.<string, string | string[] | number | number[] | null>}
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
