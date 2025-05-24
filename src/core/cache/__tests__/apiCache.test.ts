import { ApiCache } from '../apiCache'

describe('ApiCache', () => {
  let cache: ApiCache

  beforeEach(() => {
    cache = new ApiCache()
  })

  afterEach(() => {
    cache.clear()
  })

  it('should store and retrieve data', () => {
    const key = 'test-key'
    const data = { id: 1, name: 'Test' }
    
    cache.set(key, data)
    expect(cache.get(key)).toEqual(data)
  })

  it('should return null for non-existent key', () => {
    expect(cache.get('non-existent')).toBeNull()
  })

  it('should clear all data', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    
    cache.clear()
    
    expect(cache.get('key1')).toBeNull()
    expect(cache.get('key2')).toBeNull()
  })

  it('should handle TTL expiration', () => {
    jest.useFakeTimers()
    
    const key = 'ttl-test'
    const data = { test: true }
    const ttl = 1000 // 1초
    
    cache.set(key, data, ttl)
    expect(cache.get(key)).toEqual(data)
    
    jest.advanceTimersByTime(ttl + 100)
    expect(cache.get(key)).toBeNull()
    
    jest.useRealTimers()
  })
}) 