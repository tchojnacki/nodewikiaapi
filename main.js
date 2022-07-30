'use strict'

const got = require('got')

/**
 * Class representing Wikia API V1 wrapper
 * @tutorial Endpoints
 * @tutorial Getting started
 *
 * @param {string} [subdomain] - Subdomain, for example "dev" or "pl.community". Providing subdomain isn't necessary, but strongly recommended, because without it you can only use global (non-wiki) APIs.
 */
class WikiaAPI {
  constructor (subdomain) {
    /**
     * Subdomain, for example "dev" or "pl.community"
     * @see [Help:URL]{@link http://community.wikia.com/wiki/Help:URL} on Community Central
     *
     * @name WikiaAPI#subdomain
     * @type {string}
     */
    if (!subdomain) {
      this.subdomain = null
    } else {
      this.subdomain = subdomain
    }
  }

  /**
   * Get details about one or more articles
   * @see [Articles/Details]{@link http://dev.wikia.com/api/v1#!/Articles/getDetails_get_1}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.ids] - An Array of article ids or a single article id
   * @param {(string[]|string)} [options.titles] - An Array of article titles or a single article title, can be used alongside ids
   * @param {number} [options.abstract=100] - The desired length for the article's abstract
   * @param {number} [options.width=200] - The desired width for the thumbnail
   * @param {number} [options.height=200] - The desired height for the thumbnail
   * @return {Promise<Object, Error>} - A Promise with an Object containing articles details on fulfil, and Error on rejection
   */
  getArticlesDetails (options = {}) {
    const {ids, titles, abstract, width, height} = this._parseParams(options, {ids: -1, titles: '', abstract: 100, width: 200, height: 200}, {ids: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, titles: (x) => { return (typeof x === 'string' || Array.isArray(x)) }, abstract: 'number', width: 'number', height: 'number'})

    if (ids === -1 && titles === '') {
      throw new Error('Argument \'ids\' or \'titles\' should be passed')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/Details', {
        ids: this._arrayOrSingleElement(ids),
        titles: this._arrayOrSingleElement(titles, 'string'),
        abstract: abstract,
        width: width,
        height: height
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get articles list in alphabetical order
   * @see [Articles/List]{@link http://dev.wikia.com/api/v1#!/Articles/getList_get_2}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {number} [options.limit=25] - Limit the number of results
   * @param {string} [options.offset=!] - Lexicographically minimal article title
   * @return {Promise<Object, Error>} - A Promise with an Object containing articles list on fulfil, and Error on rejection
   */
  getArticlesList (options = {}) {
    const {category, namespaces, limit, offset} = this._parseParams(options, {category: '', namespaces: 0, limit: 25, offset: '!'}, {category: 'string', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, limit: 'number', offset: 'string'})

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/List', {
        category: category,
        namespaces: this._arrayOrSingleElement(namespaces),
        limit: limit,
        offset: offset
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get a list of pages on the current wiki
   * @see [Articles/List?expand=1]{@link http://dev.wikia.com/api/v1#!/Articles/getListExpanded_get_3}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {number} [options.limit=25] - Limit the number of results
   * @param {string} [options.offset=!] - Lexicographically minimal article title
   * @return {Promise<Object, Error>} - A Promise with an Object containing expanded articles list on fulfil, and Error on rejection
   */
  getArticlesListExpanded (options = {}) {
    const {category, namespaces, limit, offset} = this._parseParams(options, {category: '', namespaces: 0, limit: 25, offset: '!'}, {category: 'string', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, limit: 'number', offset: 'string'})

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/List', {
        category: category,
        namespaces: this._arrayOrSingleElement(namespaces),
        limit: limit,
        offset: offset,
        expand: 1
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get the most viewed articles on this wiki
   * @see [Aricles/Top]{@link http://dev.wikia.com/api/v1#!/Articles/getTop_get_9}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.namespaces] -- Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {number} [options.limit=10] - Limit the number of result - maximum limit is 250
   * @param {number} [baseArticleId] - Trending and popular related to article with given id
   * @return {Promise<Object, Error>} - A Promise with an Object containing top articles on fulfil, and Error on rejection
   */
  getTopArticles (options = {}) {
    const {namespaces, category, limit, baseArticleId} = this._parseParams(options, {namespaces: null, category: '', limit: 10, baseArticleId: null}, {namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x) || x === null) }, category: 'string', limit: 'number', baseArticleId: (x) => { return (typeof x === 'number' || x === null) }})

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/Top', {
        namespaces: this._arrayOrSingleElement(namespaces),
        category: category,
        limit: limit,
        baseArticleId: baseArticleId
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get the most viewed articles on this wiki (expanded results)
   * @see [Aricles/Top?expand=1]{@link http://dev.wikia.com/api/v1#!/Articles/getTopExpanded_get_10}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.namespaces] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {string} [options.category] - Return only articles belonging to the provided valid category title
   * @param {number} [options.limit=10] - Limit the number of result - maximum limit is 250
   * @param {number} [baseArticleId] - Trending and popular related to article with given id
   * @return {Promise<Object, Error>} - A Promise with an Object containing top articles on fulfil, and Error on rejection
   */
  getTopArticlesExpanded (options = {}) {
    const {namespaces, category, limit, baseArticleId} = this._parseParams(options, {namespaces: null, category: '', limit: 10, baseArticleId: null}, {namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x) || x === null) }, category: 'string', limit: 'number', baseArticleId: (x) => { return (typeof x === 'number' || x === null) }})

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/Top', {
        namespaces: this._arrayOrSingleElement(namespaces),
        category: category,
        limit: limit,
        baseArticleId: baseArticleId,
        expand: 1
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get wiki data, including key values, navigation data, and more
   * @see [Mercury/WikiVariables]{@link http://dev.wikia.com/api/v1#!/Mercury/getWikiData_get_0}
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing wiki data on fulfil, and Error on rejection
   */
  getWikiVariables () {
    return new Promise((resolve, reject) => {
      this._makeRequest('Mercury/WikiVariables').then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Find suggested phrases for chosen query
   * @see [SearchSuggestions/List](http://dev.wikia.com/api/v1#!/SearchSuggestions/getList_get_0)
   *
   * @param {Object} options - An Object containing every other parameter
   * @param {string} options.query - Search query
   * @return {Promise<Object, Error>} - A Promise with an Object containing search suggestions on fulfil, and Error on rejection
   */
  getSearchSuggestions (options = {}) {
    const {query} = this._parseParams(options, {}, {query: 'string'})

    return new Promise((resolve, reject) => {
      this._makeRequest('SearchSuggestions/List', {
        query: query
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get details about selected users
   * @see [User/Details](http://dev.wikia.com/api/v1#!/User/getDetails_get_0)
   *
   * @param {Object} options - An Object containing every other parameter
   * @param {(number[]|number)} options.ids - An Array of user ids or a single user id
   * @param {number} [options.size=100] - The desired width (and height, because it is a square) for the thumbnail, defaults to 100, 0 for no thumbnail
   * @return {Promise<Object, Error>} - A Promise with an Object containing user details on fulfil, and Error on rejection
   */
  getUserDetails (options = {}) {
    const {ids, size} = this._parseParams(options, {size: 100}, {ids: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, size: 'number'})

    return new Promise((resolve, reject) => {
      this._makeRequest('User/Details', {
        ids: ids,
        size: size
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Basepath of Wikia API V1 for given subdomain, for example "http://dev.wikia.com/api/v1/"
   * @name WikiaAPI#wikiapiurl
   * @type {string}
   * @readonly
   */
  get wikiapiurl () {
    return this.subdomain === null ? WikiaAPI.wikiaapiurl : `http://${this.subdomain}.wikia.com/api/v1`
  }
  set wikiapiurl (value) {
    throw new Error('Cannot set a read-only property \'wikiapiurl\'')
  }

  /**
   * Basepath of wiki for given subdomain, for example "http://dev.wikia.com"
   * @name WikiaAPI#wikiurl
   * @type {string}
   * @readonly
   */
  get wikiurl () {
    return this.subdomain === null ? WikiaAPI.wikiaurl : `http://${this.subdomain}.wikia.com`
  }
  set wikiurl (value) {
    throw new Error('Cannot set a read-only property \'wikiurl\'')
  }

  /**
   * Basepath of Wikia API V1 for Wikia (http://wikia.com/api/v1/)
   * @name WikiaAPI.wikiaapiurl
   * @type {string}
   * @readonly
   */
  static get wikiaapiurl () {
    return 'http://wikia.com/api/v1'
  }

  /**
   * Basepath of Wikia (http://wikia.com)
   * @name WikiaAPI.wikiaurl
   * @type {string}
   * @readonly
   */
  static get wikiaurl () {
    return 'http://wikia.com'
  }

  _makeRequest (endpoint, params, method) {
    return new Promise((resolve, reject) => {
      let query = []
      for (let param in params) {
        if (params[param] !== null) {
          query.push(param + '=' + encodeURIComponent(params[param]).replace(/%7C/g, '|'))
        }
      }

      const reqUrl = `${this.wikiapiurl}/${endpoint}?${query.join('&')}`
      got(reqUrl, {method: method || 'GET'}).then(response => {
        let body
        try {
          body = JSON.parse(response.body)
        } catch (error) {
          reject(new Error('Community not found'))
        }
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  _arrayOrSingleElement (input, inputType = 'number') {
    let outputString
    if (Array.isArray(input)) {
      outputString = input.join(',')
    } else if (typeof input === inputType) {
      outputString = input.toString()
    } else if (input === null) {
      outputString = input
    } else {
      throw new Error(`Incorrect argument type. Expected ${inputType} or array of ${inputType}s, got ${typeof input} instead`)
    }
    return outputString
  }

  _parseParams (options, defaultOptions, optionTypes) {
    let newOptions
    newOptions = Object.assign({}, defaultOptions, options)
    for (let opt in optionTypes) {
      if (typeof optionTypes[opt] === 'string') {
        if (typeof newOptions[opt] !== optionTypes[opt]) {
          throw new Error(`Bad argument type. Expected ${opt} to be a ${optionTypes[opt]}, found ${typeof newOptions[opt]} instead`)
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
