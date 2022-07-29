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
   * Get latest activity information
   * @deprecated since 2.0.5
   * @see [Activity/LatestActivity]{@link http://dev.wikia.com/api/v1#!/Activity/getLatestActivity_get_0}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} [options.limit=10] - Limit the number of results
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [options.allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing latest activity on fulfil, and Error on rejection
   */
  getLatestActivity (options = {}) {
    throw new Error('Activity/LatestActivity endpoint is no longer supported.')
  }

  /**
   * Get recently changed articles
   * @deprecated since 2.0.5
   * @see [Activity/RecentlyChangedArticles]{@link http://dev.wikia.com/api/v1#!/Activity/getRecentlyChangedArticles_get_1}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} [options.limit=10] - Limit the number of results
   * @param {(number[]|number)} [options.namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [options.allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing recently changed articles on fulfil, and Error on rejection
   */
  getRecentlyChangedArticles (options = {}) {
    throw new Error('Activity/RecentlyChangedArticles endpoint is no longer supported.')
  }

  /**
   * Get simplified article contents
   * @deprecated since 2.0.5
   * @see [Articles/AsSimpleJson]{@link http://dev.wikia.com/api/v1#!/Articles/getAsSimpleJson_get_0}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {number} options.id - A single article ID
   * @return {Promise<Object, Error>} - A Promise with an Object containing simple article data on fulfil, and Error on rejection
   */
  getArticleAsSimpleJson (options = {}) {
    throw new Error('Activity/AsSimpleJson endpoint is no longer supported.')
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
   * Get the most linked articles on this wiki
   * @deprecated since 2.0.5
   * @see [Articles/MostLinked]{@link http://dev.wikia.com/api/v1#!/Articles/getTop_get_4}
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing most linked articles on fulfil, and Error on rejection
   */
  getMostLinked () {
    throw new Error('Articles/MostLinked endpoint is no longer supported.')
  }

  /**
   * Get the most linked articles on this wiki (expanded results)
   * @deprecated since 2.0.5
   * @see [Articles/MostLinked?expand=1]{@link http://dev.wikia.com/api/v1#!/Articles/getTopExpanded_get_5}
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing most linked articles on fulfil, and Error on rejection
   */
  getMostLinkedExpanded () {
    throw new Error('Articles/MostLinked endpoint is no longer supported.')
  }

  /**
   * Get list of new articles on this wiki
   * @deprecated since 2.0.5
   * @see [Articles/New]{@link http://dev.wikia.com/api/v1#!/Articles/getNew_get_6}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {(number[]|number)} [options.namespaces] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {number} [options.limit=20] - Limit the number of result - maximum limit is 100
   * @param {number} [options.minArticleQuality=10] - Minimal value of article quality. Ranges from 0 to 99
   * @return {Promise<Object, Error>} - A Promise with an Object containing new articles on fulfil, and Error on rejection
   */
  getNewArticles (options = {}) {
    throw new Error('Articles/New endpoint is no longer supported.')
  }

  /**
   * Get popular articles for the current wiki (from the beginning of time)
   * @deprecated since 2.0.5
   * @see [Articles/Popular]{@link http://dev.wikia.com/api/v1#!/Articles/getPopular_get_7}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {integer} [options.limit=10] - Limit the number of result - maximum limit is 10
   * @param {integer} [options.baseArticleId] - Trending and popular related to article with given id
   * @return {Promise<Object, Error>} - A Promise with an Object containing popular articles on fulfil, and Error on rejection
   */
  getPopularArticles (options = {}) {
    throw new Error('Articles/Popular endpoint is no longer supported.')
  }

  /**
   * Get popular articles for the current wiki (from the beginning of time)
   * @deprecated since 2.0.5
   * @see [Articles/Popular?expand=1]{@link http://dev.wikia.com/api/v1#!/Articles/getPopularExpanded_get_8}
   *
   * @param {Object} [options] - An Object containing every other parameter
   * @param {integer} [options.limit=10] - Limit the number of result - maximum limit is 10
   * @param {integer} [options.baseArticleId] - Trending and popular related to article with given id
   * @return {Promise<Object, Error>} - A Promise with an Object containing popular articles on fulfil, and Error on rejection
   */
  getPopularArticlesExpanded (options = {}) {
    throw new Error('Articles/Popular endpoint is no longer supported.')
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
   * Get wiki navigation links (the main menu of given wiki)
   * @deprecated since 2.0.5
   * @see [Navigation/Data](http://dev.wikia.com/api/v1#!/Navigation/getData_get_0)
   *
   * @return {Promise<Object, Error>} - A Promise with an Object containing navigation data on fulfil, and Error on rejection
   */
  getNavigationData () {
    throw new Error('Navigation/Data endpoint is no longer supported.')
  }

  /**
   * Get pages related to a given article ID
   * WARNING: RelatedPages extension is disabled on every wiki
   * @deprecated since 2.0.5
   * @see [RelatedPages/List](http://dev.wikia.com/api/v1#!/RelatedPages/getList_get_0)
   *
   * @param {Object} options - An Object containing every other parameter
   * @param {(number[]|number)} options.ids - An Array of article ids or a single article id
   * @param {number} [options.limit=3] - Limit the number of results
   * @return {Promise<Object, Error>} - A Promise with an Object containing related pages on fulfil, and Error on rejection
   */
  getRelatedPages (options = {}) {
    throw new Error('RelatedPages/List endpoint is no longer supported.')
  }

  /**
   * Do search for given phrase
   * @deprecated since 2.0.5
   * @see [Search/List](http://dev.wikia.com/api/v1#!/Search/getList_get_1)
   *
   * @param {Object} options - An Object containing every other parameter
   * @param {string} options.query - Search query
   * @param {string} [options.type=articles] - The search type, either articles (default) or videos. For 'videos' value, this parameter should be used with namespaces parameter (namespaces needs to be set to 6)
   * @param {string} [options.rank=default] - The ranking to use in fetching the list of results, one of default, newest, oldest, recently-modified, stable, most-viewed, freshest, stalest
   * @param {number} [options.limit=25] - Limit the number of results
   * @param {number} [options.minArticleQuality=10] - Minimal value of article quality. Ranges from 0 to 99
   * @param {number} [options.batch=1] - The batch (page) of results to fetch
   * @param {(number[]|number)} [options.namespaces=[0, 14]] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @return {Promise<Object, Error>} - A Promise with an Object containing search results on fulfil, and Error on rejection
   */
  getSearchList (options = {}) {
    throw new Error('Search/List endpoint is no longer supported.')
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
