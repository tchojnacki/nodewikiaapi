/* global test, expect */
/* eslint no-new: 0 */

const WikiaAPI = require('../main')

test('must have a subdomain', () => {
  expect(() => {
    new WikiaAPI().getLatestActivity()
  }).toThrow()
})

test('returns correct subdomain', () => {
  expect(new WikiaAPI('dev').subdomain).toBe('dev')
})

test('can change subdomain', () => {
  expect((() => {
    const wikia = new WikiaAPI('dev')
    wikia.subdomain = 'community'
    return wikia.subdomain
  })()).toBe('community')
})

test('can\'t set wikiapiurl', () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.wikiapiurl = 'test'
  }).toThrow()
})

test('can\'t set wikiurl', () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.wikiurl = 'test'
  }).toThrow()
})
