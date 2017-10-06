'use strict'

const got = require('got')

/**
 * Class representing Wikia API V1 wrapper
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
   * Get latest activity information
   * @see [Activity/LatestActivity]{@link http://dev.wikia.com/api/v1#!/Activity/getLatestActivity_get_0}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} [options.limit=10] - Limit the number of results
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [options.allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing latest activity on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getLatestActivity (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {limit: 10, namespaces: 0, allowDuplicates: true}, {limit: 'number', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, allowDuplicates: 'boolean'})
    const {limit, namespaces, allowDuplicates} = options

    return new Promise((resolve, reject) => {
      this._makeRequest('Activity/LatestActivity', {
        limit: limit,
        namespaces: this._arrayOrSingleElement(namespaces),
        allowDuplicates: allowDuplicates
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get recently changed articles
   * @see [Activity/RecentlyChangedArticles]{@link http://dev.wikia.com/api/v1#!/Activity/getRecentlyChangedArticles_get_1}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} [options.limit=10] - Limit the number of results
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [options.allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing recently changed articles on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getRecentlyChangedArticles (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {limit: 10, namespaces: 0, allowDuplicates: true}, {limit: 'number', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, allowDuplicates: 'boolean'})
    const {limit, namespaces, allowDuplicates} = options

    return new Promise((resolve, reject) => {
      this._makeRequest('Activity/RecentlyChangedArticles', {
        limit: limit,
        namespaces: this._arrayOrSingleElement(namespaces),
        allowDuplicates: allowDuplicates
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get simplified article contents
   * @see [Articles/AsSimpleJson]{@link http://dev.wikia.com/api/v1#!/Articles/getAsSimpleJson_get_0}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} options.id - A single article ID
   * @return {Promise<Object, Error>} - A Promise with an Object containing simple article data on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getArticleAsSimpleJson (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {}, {id: 'number'})
    const {id} = options

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/AsSimpleJson', {
        id: id
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
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
   *
   * @instance
   * @memberof WikiaAPI
   */
  getArticlesDetails (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {ids: -1, titles: '', abstract: 100, width: 200, height: 200}, {ids: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, titles: (x) => { return (typeof x === 'string' || Array.isArray(x)) }, abstract: 'number', width: 'number', height: 'number'})
    const {ids, titles, abstract, width, height} = options

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
   *
   * @instance
   * @memberof WikiaAPI
   */
  getArticlesList (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {category: '', namespaces: 0, limit: 25, offset: '!'}, {category: 'string', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, limit: 'number', offset: 'string'})
    const {category, namespaces, limit, offset} = options

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
   *
   * @instance
   * @memberof WikiaAPI
   */
  getArticlesListExpanded (options = {}) {
    this._requireSubdomain()
    options = this._parseParams(options, {category: '', namespaces: 0, limit: 25, offset: '!'}, {category: 'string', namespaces: (x) => { return (typeof x === 'number' || Array.isArray(x)) }, limit: 'number', offset: 'string'})
    const {category, namespaces, limit, offset} = options

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
   * Get the most linked articles on this wiki
   * @see [Articles/MostLinked]{@link http://dev.wikia.com/api/v1#!/Articles/getTop_get_4}
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing most linked articles on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getMostLinked () {
    this._requireSubdomain()
    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/MostLinked').then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get the most linked articles on this wiki (expanded results)
   * @see [Articles/MostLinked?expand=1]{@link http://dev.wikia.com/api/v1#!/Articles/getTopExpanded_get_5}
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing most linked articles on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getMostLinkedExpanded () {
    this._requireSubdomain()
    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/MostLinked', {expand: 1}).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  set subdomain (value) {
    if (!value) {
      this.subdomain = null
    } else {
      this.subdomain = value
    }
  }

  /**
   * Basepath of Wikia API V1 for given subdomain, for example "http://dev.wikia.com/api/v1/"
   * @name WikiaAPI#wikiapiurl
   * @type {string}
   * @readonly
   */
  get wikiapiurl () {
    return this.subdomain === null ? null : `http://${this.subdomain}.wikia.com/api/v1/`
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
    return this.subdomain === null ? null : `http://${this.subdomain}.wikia.com`
  }
  set wikiurl (value) {
    throw new Error('Cannot set a read-only property \'wikiurl\'')
  }

  _makeRequest (endpoint, params) {
    return new Promise((resolve, reject) => {
      let query = []
      for (let param in params) {
        query.push(param + '=' + encodeURIComponent(params[param]))
      }

      got(`${this.wikiapiurl}${endpoint}?${query.join('&')}`).then(response => {
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
    } else {
      throw new Error(`Incorrect argument type. Expected ${inputType} or array of ${inputType}s, got ${typeof input} instead`)
    }
    return outputString
  }

  _parseParams (options, defaultOptions, optionTypes) {
    let newOptions
    newOptions = Object.assign(defaultOptions, options, {})
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

  _requireSubdomain () {
    if (this.subdomain === null) {
      throw new Error('Subdomain is required to request this endpoint')
    }
  }
}

module.exports = WikiaAPI
