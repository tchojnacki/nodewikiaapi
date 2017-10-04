'use strict'

const got = require('got')

/**
 * Class representing WikiaAPI V1
 * @param {string} subdomain - Subdomain, for example "dev" or "pl.community"
 */
class WikiaAPI {
  constructor (subdomain) {
    if (!subdomain) {
      throw new Error('Argument \'subdomain\' is required')
    }
    /**
     * Subdomain, for example "dev" or "pl.community"
     * @name WikiaAPI#subdomain
     * @type {string}
     */
    this.subdomain = subdomain
  }

  /**
   * Get latest activity information
   * @see [Wikia API Documentation]{@link http://dev.wikia.com/api/v1#!/Activity/getLatestActivity_get_0}
   *
   * @param {number} limit - Limit the number of results
   * @param {(number[]|number)} namespaces - Array of namespace ids, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing latest activity on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getLatestActivity (limit, namespaces, allowDuplicates = true) {
    if (isNaN(limit)) {
      throw new Error('Argument \'limit\' is required')
    }
    if (!namespaces) {
      throw new Error('Argument \'namespaces\' is required')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Activity/LatestActivity').then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Root of Wikia API V1 for given subdomain
   * @name WikiaAPI#url
   * @type {string}
   * @readonly
   */
  get url () {
    return `http://${this.subdomain}.wikia.com/api/v1/`
  }

  set url (value) {
    throw new Error('Cannot set a read-only property \'url\'')
  }

  _makeRequest (endpoint, params) {
    return new Promise((resolve, reject) => {
      got(this.url + endpoint).then(response => {
        resolve(response.body)
      }).catch(error => {
        reject(error.response.body)
      })
    })
  }
}

module.exports = WikiaAPI
