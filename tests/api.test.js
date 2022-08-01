// @ts-check

import WikiaAPI from '../'

describe('API', () => {
  it('correctly calls foreign community APIs', async () => {
    const language = 'pl'
    const foreignLolApi = new WikiaAPI('leagueoflegends', language)

    const { data } = await foreignLolApi.getWikiVariables()

    expect(data.language.content).toBe(language)
  })

  it('throws on unexpected params', async () => {
    const devApi = new WikiaAPI('dev')

    expect(() => {
      // @ts-ignore
      devApi.getArticleDetails({ test: true })
    }).toThrow()
  })

  it('throws on incorrect param types', async () => {
    const devApi = new WikiaAPI('dev')

    expect(() => {
      // @ts-ignore
      devApi.getArticleDetails({ ids: ['a'] })
    }).toThrow()
  })

  it('throws when requesting non-existent wiki', async () => {
    await expect(new WikiaAPI('89fcc7686189a53aeaed2aee760859d3').getWikiVariables()).rejects.toThrow()
  })

  it('ignores undefined params', async () => {
    const devApi = new WikiaAPI('dev')

    const { offset } = await devApi.getArticleList({ offset: undefined })

    expect(offset).toMatch(/^a/i)
  })
})

describe('ArticleDetails', () => {
  it('retrieves article details', async () => {
    const devApi = new WikiaAPI('dev')
    const id = 21843

    const { items } = await devApi.getArticleDetails({ ids: id })

    expect(Object.keys(items)).toStrictEqual([id.toString()])
  })

  it('requires at least one generator', () => {
    const devApi = new WikiaAPI('dev')

    expect(() => {
      devApi.getArticleDetails({})
    }).toThrow()
  })

  it('can be called with titles containing spaces', async () => {
    const devApi = new WikiaAPI('dev')

    const [first, second] = await Promise.all([
      devApi.getArticleDetails({ titles: 'List_of_JavaScript_enhancements' }),
      devApi.getArticleDetails({ titles: 'List of JavaScript enhancements' }),
    ])

    expect(Object.keys(first.items)).toStrictEqual(Object.keys(second.items))
  })

  it('can use both ids and titles at the same time', async () => {
    const devApi = new WikiaAPI('dev')

    const { items } = await devApi.getArticleDetails({ titles: 'DiscordIntegrator', ids: 1911 })

    expect(Object.keys(items)).toHaveLength(2)
  })

  it('returns correct abstract length', async () => {
    const devApi = new WikiaAPI('dev')
    const id = 9775
    const length = 42

    const { items } = await devApi.getArticleDetails({ ids: id, abstract: length })

    expect(items[id].abstract.length).toBeLessThanOrEqual(length)
  })
})

describe('ArticleList', () => {
  it('retrieves list of articles', async () => {
    const devApi = new WikiaAPI('dev')

    const { items } = await devApi.getArticleList()

    expect(items.length).toBeGreaterThan(0)
  })

  it('returns articles, which can be queried further', async () => {
    const devApi = new WikiaAPI('dev')

    const articleList = await devApi.getArticleList()
    const id = articleList.items[0].id
    const articleDetails = await devApi.getArticleDetails({ ids: id })

    expect(articleList.items[0].title).toBe(articleDetails.items[id].title)
  })

  it('filters articles by namespace', async () => {
    const devApi = new WikiaAPI('dev')
    const namespaces = 1

    const { items } = await devApi.getArticleList({ namespaces })

    expect(items.every(({ ns }) => ns === namespaces)).toBe(true)
  })

  it('correctly limits result count', async () => {
    const devApi = new WikiaAPI('dev')
    const limit = 10

    const { items } = await devApi.getArticleList({ limit })

    expect(items.length).toBeLessThanOrEqual(limit)
  })
})

describe('TopArticles', () => {
  it('retrieves top articles', async () => {
    const devApi = new WikiaAPI('dev')

    const { items } = await devApi.getTopArticles()

    expect(items.length).toBeGreaterThan(0)
  })

  it('filters articles by namespace', async () => {
    const devApi = new WikiaAPI('dev')
    const namespaces = 1

    const { items } = await devApi.getTopArticles({ namespaces })

    expect(items.every(({ ns }) => ns === namespaces)).toBe(true)
  })

  it('correctly limits result count', async () => {
    const devApi = new WikiaAPI('dev')
    const limit = 10

    const { items } = await devApi.getTopArticles({ limit })

    expect(items.length).toBeLessThanOrEqual(limit)
  })
})

describe('WikiVariables', () => {
  it('retrieves wiki variables', async () => {
    const devApi = new WikiaAPI('dev')

    const { data } = await devApi.getWikiVariables()

    expect(data.isClosed).toBe(false)
    expect(data.language.content).toBe('en')
  })
})

describe('SearchSuggestions', () => {
  it('retrieves search suggestions', async () => {
    const devApi = new WikiaAPI('dev')
    const searchTerm = 'C'

    const { items } = await devApi.getSearchSuggestions(searchTerm)

    expect(items.every(i => i.title.startsWith(searchTerm))).toBe(true)
  })
})

describe('UserDetails', () => {
  it('retrieves user details', async () => {
    const devApi = new WikiaAPI('dev')

    const { items } = await devApi.getUserDetails({ ids: 26200197 })

    expect(items[0].name).toBe('DuckeyD')
  })

  it('fetches correct thumbnail size', async () => {
    const devApi = new WikiaAPI('dev')
    const size = 64

    const { items } = await devApi.getUserDetails({ ids: 26200197, size })

    expect(items[0].avatar.endsWith(`width/${size}/height/${size}`)).toBe(true)
  })
})
