import { MethodChainImpl } from '../MethodChainImpl'
import { UrlBuilder } from '../UrlBuilder'
import { UrlBuilderFactory } from '../UrlBuilderFactory'
import { ResourceMap, BaseChain } from '../chainTypes'

describe('MethodChainImpl', () => {
  let urlBuilder: UrlBuilder
  let resources: ResourceMap

  beforeEach(() => {
    // URL 빌더 팩토리 설정
    const factory = UrlBuilderFactory.getInstance()
    factory.registerPreset('test', {
      baseUrl: 'https://api.example.com',
      version: '1',
      prefix: 'api'
    })
    urlBuilder = factory.create('test')

    // 테스트용 리소스 정의
    resources = {
      users: {
        path: '/users',
        methods: ['GET', 'POST'],
        queryParams: ['fields', 'include']
      },
      user: {
        path: '/users/:id',
        methods: ['GET', 'PUT', 'DELETE'],
        params: ['id'],
        queryParams: ['fields']
      },
      userPosts: {
        path: '/users/:userId/posts/:postId?',
        methods: ['GET'],
        params: ['userId', 'postId'],
        queryParams: ['include']
      }
    }
  })

  describe('resource selection', () => {
    it('should select a valid resource', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => chain.resource('users')).not.toThrow()
    })

    it('should throw for invalid resource', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => chain.resource('invalid')).toThrow()
    })
  })

  describe('HTTP method selection', () => {
    it('should allow valid HTTP method for resource', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => chain.resource('users').get()).not.toThrow()
      expect(() => chain.resource('users').post()).not.toThrow()
    })

    it('should throw for invalid HTTP method', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => chain.resource('users').put()).toThrow()
      expect(() => chain.resource('users').delete()).toThrow()
    })

    it('should throw when selecting method before resource', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => (chain as any).get()).toThrow()
    })
  })

  describe('parameter handling', () => {
    it('should accept valid parameters', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const methodChain = chain.resource('user').get()
      expect(() => methodChain.withParams({ id: '123' })).not.toThrow()
    })

    it('should throw for invalid parameters', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const methodChain = chain.resource('user').get()
      expect(() => methodChain.withParams({ invalid: '123' })).toThrow()
    })

    it('should throw when setting params before method', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const resourceChain = chain.resource('user')
      expect(() => (resourceChain as any).withParams({ id: '123' })).toThrow()
    })
  })

  describe('query parameter handling', () => {
    it('should accept valid query parameters', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const methodChain = chain.resource('users').get()
      expect(() => methodChain.withQuery({ fields: 'name,email' })).not.toThrow()
    })

    it('should throw for invalid query parameters', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const methodChain = chain.resource('users').get()
      expect(() => methodChain.withQuery({ invalid: 'value' })).toThrow()
    })

    it('should throw when setting query before method', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const resourceChain = chain.resource('users')
      expect(() => (resourceChain as any).withQuery({ fields: 'name' })).toThrow()
    })
  })

  describe('URL building', () => {
    it('should build URL with all components', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const url = chain
        .resource('user')
        .get()
        .withParams({ id: '123' })
        .withQuery({ fields: 'name,email' })
        .build()

      expect(url).toBe('https://api.example.com/v1/api/users/123?fields=name%2Cemail')
    })

    it('should build URL with optional parameters', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const url = chain
        .resource('userPosts')
        .get()
        .withParams({ userId: '123', postId: '456' })
        .withQuery({ include: 'comments' })
        .build()

      expect(url).toBe('https://api.example.com/v1/api/users/123/posts/456?include=comments')
    })

    it('should throw when building without required components', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      expect(() => chain.build()).toThrow()
      expect(() => chain.resource('users').build()).toThrow()
    })
  })

  describe('state management', () => {
    it('should maintain state through the chain', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      const url = chain
        .resource('users')
        .get()
        .withQuery({ fields: 'name' })
        .withQuery({ include: 'profile' })
        .build()

      expect(url).toBe('https://api.example.com/v1/api/users?fields=name&include=profile')
    })

    it('should reset state for new chain', () => {
      const chain = MethodChainImpl.create(urlBuilder, resources)
      
      // 첫 번째 URL 생성
      const url1 = chain
        .resource('user')
        .get()
        .withParams({ id: '123' })
        .build()

      // 두 번째 URL 생성 (새로운 체인)
      const url2 = chain
        .resource('users')
        .get()
        .withQuery({ fields: 'name' })
        .build()

      expect(url1).toBe('https://api.example.com/v1/api/users/123')
      expect(url2).toBe('https://api.example.com/v1/api/users?fields=name')
    })
  })
}) 