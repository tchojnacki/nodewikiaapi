// @ts-check

const got = require('got')

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

    return this._makeRequest('Articles/Details', {
      ids: this._arrayOrSingleElement(ids),
      titles: this._arrayOrSingleElement(titles, 'string'),
      abstract,
    })
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

    return this._makeRequest('Articles/List', {
      category,
      namespaces: this._arrayOrSingleElement(namespaces),
      limit,
      offset,
    })
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

    return this._makeRequest('Articles/Top', {
      namespaces: this._arrayOrSingleElement(namespaces),
      category,
      limit,
    })
  }

  /**
   * Get wiki data, including key values, navigation data and more.
   *
   * @returns {Promise<WikiVariablesRes>}
   *
   * @see {@link WikiVariablesRes}
   */
  getWikiVariables() {
    return this._makeRequest('Mercury/WikiVariables')
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
    return this._makeRequest('SearchSuggestions/List', { query: q })
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

    return this._makeRequest('User/Details', { ids, size })
  }

  /**
   * Basepath of Wikia API V1 for the given subdomain and language, for example "http://dev.fandom.com/api/v1/".
   * @type {string}
   * @readonly
   */
  get apiBasepath() {
    return `https://${this.subdomain}.fandom.com/${this.language ? `${this.language}/` : ''}api/v1/`
  }

  /** @private */
  _makeRequest(endpoint, params, method) {
    return new Promise((resolve, reject) => {
      let query = []
      for (let param in params) {
        if (params[param] !== null) {
          query.push(param + '=' + encodeURIComponent(params[param]).replace(/%7C/g, '|'))
        }
      }

      const reqUrl = `${this.apiBasepath}${endpoint}?${query.join('&')}`
      got(reqUrl, { method: method || 'GET' })
        .then(response => {
          let body
          try {
            body = JSON.parse(response.body)
          } catch (error) {
            reject(new Error('Community not found'))
          }
          resolve(body)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /** @private */
  _arrayOrSingleElement(input, inputType = 'number') {
    let outputString
    if (Array.isArray(input)) {
      outputString = input.join(',')
    } else if (typeof input === inputType) {
      outputString = input.toString()
    } else if (input === null) {
      outputString = input
    } else {
      throw new Error(
        `Incorrect argument type. Expected ${inputType} or array of ${inputType}s, got ${typeof input} instead`
      )
    }
    return outputString
  }

  /** @private */
  _parseParams(options, defaultOptions, optionTypes) {
    let newOptions
    newOptions = Object.assign({}, defaultOptions, options)
    for (let opt in optionTypes) {
      if (typeof optionTypes[opt] === 'string') {
        if (typeof newOptions[opt] !== optionTypes[opt]) {
          throw new Error(
            `Bad argument type. Expected ${opt} to be a ${optionTypes[opt]}, found ${typeof newOptions[opt]} instead`
          )
        }
      } else {
        if (!optionTypes[opt](newOptions[opt])) {
          throw new Error(`Bad argument type for ${opt}`)
        }
      }
    }
    return newOptions
  }
}

module.exports = WikiaAPI
