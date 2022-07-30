// @ts-check

const WikiaAPI = require('../main')

test('ArticleDetails must return an object', () => {
  expect.assertions(2)
  return new WikiaAPI('dev').getArticleDetails({ ids: 8168 }).then(data => {
    expect(typeof data).toBe('object')
    expect(Object.keys(data.items)).toHaveLength(1)
  })
})

test('ArticleDetails needs at least one generator', () => {
  expect(() => {
    new WikiaAPI('dev').getArticleDetails()
  }).toThrow()
})

test('ArticleDetails with space in title', () => {
  expect.assertions(1)

  const wikia = new WikiaAPI('dev')
  return Promise.all([
    wikia.getArticleDetails({ titles: 'Lua_templating/Basics' }),
    wikia.getArticleDetails({ titles: 'Lua templating/Basics' }),
  ]).then(data => {
    expect(Object.keys(data[0].items)).toEqual(Object.keys(data[1].items))
  })
})

test('ArticleList must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticleList().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticleListExpanded must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticleListExpanded().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticleList and ArticleListExpanded must return same articles', () => {
  expect.assertions(1)

  const wikia = new WikiaAPI('dev')
  return Promise.all([wikia.getArticleList(), wikia.getArticleListExpanded()]).then(data => {
    expect(Object.keys(data[0].items)).toEqual(Object.keys(data[1].items))
  })
})

test('TopArticles must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getTopArticles().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('TopArticlesExpanded must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getTopArticlesExpanded().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('TopArticles and TopArticlesExpanded must return same articles', () => {
  expect.assertions(1)

  const wikia = new WikiaAPI('dev')
  return Promise.all([wikia.getTopArticles(), wikia.getTopArticlesExpanded()]).then(data => {
    expect(Object.keys(data[0].items)).toEqual(Object.keys(data[1].items))
  })
})

test('WikiVariables must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getWikiVariables().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('SearchSuggestions must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getSearchSuggestions({ query: 'js' }).then(data => {
    expect(typeof data).toBe('object')
  })
})

test('UserDetails must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getUserDetails({ ids: 26200197 }).then(data => {
    expect(typeof data).toBe('object')
  })
})
