/* global test, expect */
/* eslint no-new: 0 */

const WikiaAPI = require('../main')

test('must have a subdomain', () => {
  expect(() => { new WikiaAPI() }).toThrow()
  expect(() => { new WikiaAPI('') }).toThrow()
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

test('can\'t set url', () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.url = 'test'
  }).toThrow()
})

test('can\'t set basepath', () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.basepath = 'test'
  }).toThrow()
})
