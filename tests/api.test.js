const WikiaAPI = require('../main')

test('limit is working', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getLatestActivity(10).then(data => {
    expect(data.items.length).toBe(10)
  })
})

test('LatestActivity must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getLatestActivity().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('RecentlyChangedArticles must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getRecentlyChangedArticles().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticleAsSimpleJson must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticleAsSimpleJson(12649).then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticleAsSimpleJson should catch on 404', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticleAsSimpleJson(1).catch(error => {
    expect(error.statusCode).toBe(404)
  })
})

test('ArticlesDetails must return an object', () => {
  expect.assertions(2)
  return new WikiaAPI('dev').getArticlesDetails(12649).then(data => {
    expect(typeof data).toBe('object')
    expect(Object.keys(data.items).length).toBe(1)
  })
})

test('ArticlesDetails needs at least one generator', () => {
  expect(() => {
    new WikiaAPI('dev').getArticlesDetails()
  }).toThrow()
})
