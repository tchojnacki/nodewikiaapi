/* global test, expect */
/* eslint no-new: 0 */

const WikiaAPI = require('../main')
/*
test('must have a subdomain if required', () => {
  expect(() => {
    new WikiaAPI().getLatestActivity()
  }).toThrow()
})
*/
test('returns statics', () => {
  expect(WikiaAPI.wikiaurl).toBe('http://wikia.com')
  expect(WikiaAPI.wikiaapiurl).toBe('http://wikia.com/api/v1')
})

test('returns correct subdomain', () => {
  expect(new WikiaAPI('dev').subdomain).toBe('dev')
})

test('can change subdomain', () => {
  expect(
    (() => {
      const wikia = new WikiaAPI('dev')
      wikia.subdomain = 'community'
      return wikia.subdomain
    })()
  ).toBe('community')
})

test("can't set wikiapiurl", () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.wikiapiurl = 'test'
  }).toThrow()
})

test("can't set wikiurl", () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.wikiurl = 'test'
  }).toThrow()
})

test('wikiurl without subdomain', () => {
  const wikia = new WikiaAPI()
  expect(wikia.wikiurl).toBe(WikiaAPI.wikiaurl)
  expect(wikia.wikiapiurl).toBe(WikiaAPI.wikiaapiurl)
})
