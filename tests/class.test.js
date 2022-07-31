// @ts-check

const WikiaAPI = require('../')

describe('WikiaAPI', () => {
  it('saves subdomain correctly', () => {
    const devApi = new WikiaAPI('dev')

    expect(devApi.subdomain).toBe('dev')
    expect(devApi.language).toBeNull()
    expect(devApi.apiBasepath).toBe('https://dev.fandom.com/api/v1/')
  })

  it('can have a custom language', () => {
    const plLolApi = new WikiaAPI('leagueoflegends', 'pl')

    expect(plLolApi.subdomain).toBe('leagueoflegends')
    expect(plLolApi.language).toBe('pl')
    expect(plLolApi.apiBasepath).toBe('https://leagueoflegends.fandom.com/pl/api/v1/')
  })

  it('can have subdomain changed', () => {
    const wikia = new WikiaAPI('dev')
    wikia.subdomain = 'community'

    expect(wikia.apiBasepath).toBe('https://community.fandom.com/api/v1/')
  })
})
