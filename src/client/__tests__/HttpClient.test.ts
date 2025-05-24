import { HttpClient, HttpError } from '../HttpClient'
import { z } from 'zod'

// 전역 fetch 모의 구현
const mockFetch = jest.fn()
global.fetch = mockFetch
global.AbortController = jest.fn().mockImplementation(() => ({
  signal: 'test-signal',
  abort: jest.fn()
}))

describe('HttpClient', () => {
  let client: HttpClient

  beforeEach(() => {
    client = new HttpClient({
      baseURL: 'https://api.example.com',
      timeout: 5000
    })
    mockFetch.mockClear()
    jest.useRealTimers()
  })

  describe('request methods', () => {
    it('should make GET request', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await client.get('/users')
      expect(response).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should make POST request with data', async () => {
      const requestData = { name: 'Test User' }
      const mockResponse = { id: 1, ...requestData }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const response = await client.post('/users', { data: requestData })
      expect(response).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData)
        })
      )
    })
  })

  describe('URL building', () => {
    it('should handle URL parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await client.get('/users/:id', {
        params: { id: '123' }
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/123',
        expect.any(Object)
      )
    })

    it('should handle query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await client.get('/users', {
        query: { page: '1', limit: '10' }
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?page=1&limit=10',
        expect.any(Object)
      )
    })

    it('should handle array query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await client.get('/users', {
        query: { ids: ['1', '2', '3'] }
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?ids[]=1&ids[]=2&ids[]=3',
        expect.any(Object)
      )
    })
  })

  describe('response handling', () => {
    it('should validate response with schema', async () => {
      const mockResponse = { id: 1, name: 'Test User' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const UserSchema = z.object({
        id: z.number(),
        name: z.string()
      })

      const response = await client.get('/users/1', {}, { schema: UserSchema })
      expect(response).toEqual(mockResponse)
    })

    it('should throw validation error for invalid response', async () => {
      const mockResponse = { id: 'invalid', name: 123 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const UserSchema = z.object({
        id: z.number(),
        name: z.string()
      })

      await expect(
        client.get('/users/1', {}, { schema: UserSchema })
      ).rejects.toThrow()
    })

    it('should return raw response when requested', async () => {
      const mockResponse = new Response(JSON.stringify({ data: 'test' }))
      mockFetch.mockResolvedValueOnce(mockResponse)

      const response = await client.get('/users', {}, { raw: true })
      expect(response).toBeInstanceOf(Response)
    })
  })

  describe('error handling', () => {
    it('should throw HttpError for non-ok response', async () => {
      const errorResponse = {
        message: 'Not Found'
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(errorResponse)
      })

      try {
        await client.get('/users/999')
        fail('Expected error to be thrown')
      } catch (error) {
        if (error instanceof HttpError) {
          expect(error.response.status).toBe(404)
          expect(error.data).toEqual(errorResponse)
        } else {
          fail('Expected HttpError to be thrown')
        }
      }
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      await expect(client.get('/users')).rejects.toThrow('Network Error')
    })

    it('should handle timeout', async () => {
      const abortError = new Error('The operation was aborted')
      abortError.name = 'AbortError'

      mockFetch.mockRejectedValueOnce(abortError)

      await expect(client.get('/users')).rejects.toThrow('The operation was aborted')
    })
  })

  describe('interceptors', () => {
    it('should handle request interceptor', async () => {
      const interceptor = {
        onRequest: jest.fn().mockImplementation(config => ({
          ...config,
          headers: {
            ...config.headers,
            'X-Custom-Header': 'test'
          }
        }))
      }

      client.addRequestInterceptor(interceptor)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await client.get('/users')

      expect(interceptor.onRequest).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'test'
          })
        })
      )
    })

    it('should handle response interceptor', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: () => Promise.resolve(mockResponse)
      }
      mockFetch.mockResolvedValueOnce(mockResponseObj)

      const interceptor = {
        onResponse: jest.fn().mockImplementation((response, config) => ({
          ...mockResponse,
          modified: true
        }))
      }

      client.addResponseInterceptor(interceptor)

      const response = await client.get('/users')
      expect(interceptor.onResponse).toHaveBeenCalledWith(
        mockResponseObj,
        expect.any(Object)
      )
      expect(response).toEqual({
        data: 'test',
        modified: true
      })
    })
  })
}) 