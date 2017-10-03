'use strict'

/**
 * Main class
 * @param {string} url - Wiki url, for example "dev" or "pl.community"
 */
class WikiaAPI {
  constructor (url) {
    if (url === undefined) {
      throw new Error('Argument \'url\' is required')
    }
    this.url = url
  }
}

module.exports = WikiaAPI
