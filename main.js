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
     * Subdomain, for example "dev" for "dev.fandom.com"
     * @type {string}
     */
    this.subdomain = subdomain

    /**
     * Language code, for example "pl" for "leagueoflegends.fandom.com/pl"
     * @type {string | null}
     */
    this.language = language ?? null
  }

  /**
   * Get details about one or more articles
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.ids] - An Array of article ids or a single article id
   * @param {(string[]|string)} [options.titles] - An Array of article titles or a single article title, can be used alongside ids
   * @param {number} [options.abstract=100] - The desired length for the article's abstract
   * @return {Promise<Object, Error>} - A Promise with an Object containing articles details on fulfil, and Error on rejection
   */
  getArticleDetails(options = {}) {
    const { ids, titles, abstract } = this._parseParams(
      options,
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
      abstract: abstract,
    })
  }

  /**
   * Get articles list in alphabetical order
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {number} [options.limit=25] - Limit the number of results
   * @param {string} [options.offset="!"] - Lexicographically minimal article title
   * @return {Promise<Object, Error>} - A Promise with an Object containing articles list on fulfil, and Error on rejection
   */
  getArticleList(options = {}) {
    const { category, namespaces, limit, offset } = this._parseParams(
      options,
      { category: '', namespaces: 0, limit: 25, offset: '!' },
      {
        category: 'string',
        namespaces: x => typeof x === 'number' || Array.isArray(x),
        limit: 'number',
        offset: 'string',
      }
    )

    return this._makeRequest('Articles/List', {
      category: category,
      namespaces: this._arrayOrSingleElement(namespaces),
      limit: limit,
      offset: offset,
    })
  }

  /**
   * Get the most viewed articles on this wiki
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.namespaces] -- Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {number} [options.limit=10] - Limit the number of result - maximum limit is 250
   * @return {Promise<Object, Error>} - A Promise with an Object containing top articles on fulfil, and Error on rejection
   */
  getTopArticles(options = {}) {
    const { namespaces, category, limit } = this._parseParams(
      options,
      { namespaces: null, category: '', limit: 10 },
      {
        namespaces: x => typeof x === 'number' || Array.isArray(x) || x === null,
        category: 'string',
        limit: 'number',
      }
    )

    return this._makeRequest('Articles/Top', {
      namespaces: this._arrayOrSingleElement(namespaces),
      category: category,
      limit: limit,
    })
  }

  /**
   * Get wiki data, including key values, navigation data, and more
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing wiki data on fulfil, and Error on rejection
   */
  getWikiVariables() {
    return this._makeRequest('Mercury/WikiVariables')
  }

  /**
   * Find suggested phrases for chosen query
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {string} [options.query] - Search query
   * @return {Promise<Object, Error>} - A Promise with an Object containing search suggestions on fulfil, and Error on rejection
   */
  getSearchSuggestions(options = {}) {
    const { query } = this._parseParams(options, {}, { query: 'string' })

    return this._makeRequest('SearchSuggestions/List', {
      query: query,
    })
  }

  /**
   * Get details about selected users
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.ids] - An Array of user ids or a single user id
   * @param {number} [options.size=100] - The desired width (and height, because it is a square) for the thumbnail, defaults to 100, 0 for no thumbnail
   * @return {Promise<Object, Error>} - A Promise with an Object containing user details on fulfil, and Error on rejection
   */
  getUserDetails(options = {}) {
    const { ids, size } = this._parseParams(
      options,
      { size: 100 },
      {
        ids: x => typeof x === 'number' || Array.isArray(x),
        size: 'number',
      }
    )

    return this._makeRequest('User/Details', {
      ids: ids,
      size: size,
    })
  }

  /**
   * Basepath of Wikia API V1 for the given subdomain and language, for example "http://dev.fandom.com/api/v1/"
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
