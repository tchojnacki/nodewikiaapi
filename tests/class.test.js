const WikiaAPI = require('../main')

test('returns correct subdomain', () => {
  expect(new WikiaAPI('dev').subdomain).toBe('dev')
})
