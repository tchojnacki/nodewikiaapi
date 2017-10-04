const WikiaAPI = require('../main')

test('must have a subdomain', () => {
  expect(() => { new WikiaAPI() }).toThrow()
  expect(() => { new WikiaAPI('') }).toThrow()
})

test('returns correct subdomain', () => {
  expect(new WikiaAPI('dev').subdomain).toBe('dev')
})

test('can\'t set url', () => {
  expect(() => {
    const wikia = new WikiaAPI('dev')
    wikia.url = 'community'
  }).toThrow()
})
