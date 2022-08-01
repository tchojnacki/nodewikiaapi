// @ts-check

import WikiaAPI from '../'

test('ArticleDetails must return an object', () => {
  expect.assertions(2)
  return new WikiaAPI('dev').getArticleDetails({ ids: 8168 }).then(data => {
    expect(typeof data).toBe('object')
    expect(Object.keys(data.items)).toHaveLength(1)
  })
})

test('ArticleDetails needs at least one generator', () => {
  expect(() => {
    new WikiaAPI('dev').getArticleDetails({})
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

test('TopArticles must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getTopArticles().then(data => {
    expect(typeof data).toBe('object')
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
  return new WikiaAPI('dev').getSearchSuggestions('js').then(data => {
    expect(typeof data).toBe('object')
  })
})

test('UserDetails must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getUserDetails({ ids: 26200197 }).then(data => {
    expect(typeof data).toBe('object')
  })
})
