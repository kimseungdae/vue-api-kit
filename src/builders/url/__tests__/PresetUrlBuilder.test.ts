import { PresetUrlBuilder } from '../PresetUrlBuilder'

describe('PresetUrlBuilder', () => {
  let builder: PresetUrlBuilder

  beforeEach(() => {
    builder = new PresetUrlBuilder()
  })

  it('should build user path with ID', () => {
    const result = builder.chain()
      .user()
      .byId(1)
      .build()

    expect(result.path).toBe('/user/byId/1')
    expect(result.params).toEqual({ userId: 1 })
  })

  it('should build nested path with multiple IDs', () => {
    const result = builder.chain()
      .user()
      .byId(1)
      .posts()
      .byId(2)
      .comments()
      .build()

    expect(result.path).toBe('/user/byId/1/posts/byId/2/comments')
    expect(result.params).toEqual({
      userId: 1,
      postId: 2
    })
  })

  it('should build auth paths', () => {
    const loginResult = builder.chain()
      .auth()
      .login()
      .build()

    expect(loginResult.path).toBe('/auth/login')
    expect(loginResult.params).toEqual({})

    const logoutResult = builder.chain()
      .auth()
      .logout()
      .build()

    expect(logoutResult.path).toBe('/auth/logout')
    expect(logoutResult.params).toEqual({})
  })

  it('should reset builder state between chains', () => {
    const firstResult = builder.chain()
      .user()
      .byId(1)
      .build()

    const secondResult = builder.chain()
      .auth()
      .login()
      .build()

    expect(firstResult.path).toBe('/user/byId/1')
    expect(secondResult.path).toBe('/auth/login')
  })

  it('should handle optional parameters', () => {
    const result = builder.chain()
      .user()
      .posts()
      .build()

    expect(result.path).toBe('/user/posts')
    expect(result.params).toEqual({})
  })
}) 