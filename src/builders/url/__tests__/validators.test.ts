import { HttpMethodValidator, UrlParamsValidator, QueryParamsValidator, ResourceValidator } from '../validators'
import { ResourceDefinition } from '../chainTypes'
import { HttpMethod, UrlParams } from '../types'

describe('HttpMethodValidator', () => {
  const resource: ResourceDefinition = {
    path: '/users',
    methods: ['GET', 'POST']
  }

  describe('validateMethodExists', () => {
    it('should not throw for valid HTTP methods', () => {
      expect(() => HttpMethodValidator.validateMethodExists('GET')).not.toThrow()
      expect(() => HttpMethodValidator.validateMethodExists('POST')).not.toThrow()
      expect(() => HttpMethodValidator.validateMethodExists('PUT')).not.toThrow()
      expect(() => HttpMethodValidator.validateMethodExists('DELETE')).not.toThrow()
      expect(() => HttpMethodValidator.validateMethodExists('PATCH')).not.toThrow()
    })

    it('should throw for invalid HTTP methods', () => {
      expect(() => HttpMethodValidator.validateMethodExists('INVALID' as HttpMethod)).toThrow()
      expect(() => HttpMethodValidator.validateMethodExists('HEAD' as HttpMethod)).toThrow()
    })
  })

  describe('validate', () => {
    it('should not throw for allowed methods', () => {
      expect(() => HttpMethodValidator.validate('GET', resource)).not.toThrow()
      expect(() => HttpMethodValidator.validate('POST', resource)).not.toThrow()
    })

    it('should throw for disallowed methods', () => {
      expect(() => HttpMethodValidator.validate('PUT', resource)).toThrow()
      expect(() => HttpMethodValidator.validate('DELETE', resource)).toThrow()
    })
  })
})

describe('UrlParamsValidator', () => {
  const resource: ResourceDefinition = {
    path: '/users/:id/posts/:postId',
    methods: ['GET'],
    params: ['id', 'postId', 'optional']
  }

  describe('validate', () => {
    it('should not throw for valid parameters', () => {
      expect(() => UrlParamsValidator.validate({ id: '123', postId: '456' }, resource)).not.toThrow()
    })

    it('should throw for missing required parameters', () => {
      expect(() => UrlParamsValidator.validate({ id: '123' }, resource)).toThrow()
      expect(() => UrlParamsValidator.validate({ postId: '456' }, resource)).toThrow()
    })

    it('should throw for invalid parameters', () => {
      expect(() => UrlParamsValidator.validate({ id: '123', postId: '456', invalid: 'value' }, resource)).toThrow()
    })

    it('should throw for null or undefined values', () => {
      const paramsWithNull = { id: '123', postId: '456' } as UrlParams
      const paramsWithUndefined = { id: '123', postId: '456' } as UrlParams
      // @ts-ignore - 테스트를 위해 의도적으로 잘못된 타입 할당
      paramsWithNull.postId = null
      // @ts-ignore - 테스트를 위해 의도적으로 잘못된 타입 할당
      paramsWithUndefined.postId = undefined
      
      expect(() => UrlParamsValidator.validate(paramsWithNull, resource)).toThrow()
      expect(() => UrlParamsValidator.validate(paramsWithUndefined, resource)).toThrow()
    })

    it('should throw for empty string values', () => {
      expect(() => UrlParamsValidator.validate({ id: '123', postId: '' }, resource)).toThrow()
    })
  })
})

describe('QueryParamsValidator', () => {
  const resource: ResourceDefinition = {
    path: '/users',
    methods: ['GET'],
    queryParams: ['page', 'limit', 'sort']
  }

  describe('validate', () => {
    it('should not throw for valid query parameters', () => {
      expect(() => QueryParamsValidator.validate({ page: '1', limit: '10' }, resource)).not.toThrow()
    })

    it('should throw for invalid query parameters', () => {
      expect(() => QueryParamsValidator.validate({ invalid: 'value' }, resource)).toThrow()
    })

    it('should throw for undefined values', () => {
      expect(() => QueryParamsValidator.validate({ page: undefined }, resource)).toThrow()
    })

    it('should throw for empty arrays', () => {
      expect(() => QueryParamsValidator.validate({ page: [] }, resource)).toThrow()
    })

    it('should not throw for non-empty arrays', () => {
      expect(() => QueryParamsValidator.validate({ page: ['1', '2'] }, resource)).not.toThrow()
    })

    it('should throw when query params are not allowed', () => {
      const resourceWithoutQuery: ResourceDefinition = {
        path: '/users',
        methods: ['GET']
      }
      expect(() => QueryParamsValidator.validate({ page: '1' }, resourceWithoutQuery)).toThrow()
    })
  })
})

describe('ResourceValidator', () => {
  const resource: ResourceDefinition = {
    path: '/users/:id',
    methods: ['GET', 'PUT'],
    params: ['id'],
    queryParams: ['fields']
  }

  describe('validateAll', () => {
    it('should not throw for valid request', () => {
      expect(() => ResourceValidator.validateAll(
        'GET',
        { id: '123' },
        { fields: 'name,email' },
        resource
      )).not.toThrow()
    })

    it('should throw for invalid method', () => {
      expect(() => ResourceValidator.validateAll(
        'POST',
        { id: '123' },
        { fields: 'name,email' },
        resource
      )).toThrow()
    })

    it('should throw for invalid params', () => {
      expect(() => ResourceValidator.validateAll(
        'GET',
        { invalid: '123' },
        { fields: 'name,email' },
        resource
      )).toThrow()
    })

    it('should throw for invalid query', () => {
      expect(() => ResourceValidator.validateAll(
        'GET',
        { id: '123' },
        { invalid: 'value' },
        resource
      )).toThrow()
    })
  })
}) 