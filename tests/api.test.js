// @ts-check

const WikiaAPI = require('../main')

test('ArticlesDetails must return an object', () => {
  expect.assertions(2)
  return new WikiaAPI('dev').getArticlesDetails({ ids: 8168 }).then(data => {
    expect(typeof data).toBe('object')
    expect(Object.keys(data.items)).toHaveLength(1)
  })
})

test('ArticlesDetails needs at least one generator', () => {
  expect(() => {
    new WikiaAPI('dev').getArticlesDetails()
  }).toThrow()
})

test('ArticlesDetails with space in title', () => {
  expect.assertions(1)

  const wikia = new WikiaAPI('dev')
  return Promise.all([
    wikia.getArticlesDetails({ titles: 'Lua_templating/Basics' }),
    wikia.getArticlesDetails({ titles: 'Lua templating/Basics' }),
  ]).then(data => {
    expect(Object.keys(data[0].items)).toEqual(Object.keys(data[1].items))
  })
})

test('ArticlesList must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticlesList().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticlesListExpanded must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getArticlesListExpanded().then(data => {
    expect(typeof data).toBe('object')
  })
})

test('ArticlesList and ArticlesListExpanded must return same articles', () => {
  expect.assertions(1)

  const wikia = new WikiaAPI('dev')
  return Promise.all([wikia.getArticlesList(), wikia.getArticlesListExpanded()]).then(data => {
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
