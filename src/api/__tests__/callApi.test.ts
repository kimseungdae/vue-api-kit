import { callApi } from '../callApi'
import { apiClient } from '../config'
import {
  ApiError,
  ResponseValidationError,
  RequestValidationError,
  MissingPathParamError
} from '../../core/errors'
import { z } from 'zod'

// Mock axios client
jest.mock('../config', () => ({
  apiClient: {
    request: jest.fn()
  }
}))

describe('callApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('성공 케이스', () => {
    it('should make GET request with query parameters', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: 1,
              name: 'John',
              email: 'john@example.com',
              role: 'user',
              createdAt: '2024-02-20T00:00:00.000Z'
            }
          ],
          total: 1
        }
      }

      ;(apiClient.request as jest.Mock).mockResolvedValueOnce(mockResponse)

      const result = await callApi('getUsers', { page: 1, limit: 10 })

      expect(apiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users',
        params: { page: 1, limit: 10 },
        data: undefined
      })

      expect(result).toEqual(mockResponse.data)
    })

    it('should make GET request with path parameters', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 'user',
          createdAt: '2024-02-20T00:00:00.000Z'
        }
      }

      ;(apiClient.request as jest.Mock).mockResolvedValueOnce(mockResponse)

      const result = await callApi('getUser', { id: 1 })

      expect(apiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users/1',
        params: { id: 1 },
        data: undefined
      })

      expect(result).toEqual(mockResponse.data)
    })

    it('should make POST request with body data', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 'user',
          createdAt: '2024-02-20T00:00:00.000Z'
        }
      }

      ;(apiClient.request as jest.Mock).mockResolvedValueOnce(mockResponse)

      const userData = {
        name: 'John',
        email: 'john@example.com',
        role: 'user'
      }

      const result = await callApi('createUser', userData)

      expect(apiClient.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/users',
        params: undefined,
        data: userData
      })

      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('에러 케이스', () => {
    it('should throw MissingPathParamError when path parameter is missing', async () => {
      await expect(callApi('getUser', {})).rejects.toThrow(MissingPathParamError)
      await expect(callApi('getUser', {})).rejects.toThrow('필수 경로 파라미터가 누락되었습니다: id')
    })

    it('should throw RequestValidationError for invalid request data', async () => {
      await expect(callApi('createUser', { name: 123 })).rejects.toThrow(RequestValidationError)
    })

    it('should throw ResponseValidationError for invalid response data', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'John',
          invalidField: 'test'
        }
      }

      ;(apiClient.request as jest.Mock).mockResolvedValueOnce(mockResponse)

      await expect(callApi('getUser', { id: 1 })).rejects.toThrow(ResponseValidationError)
    })

    it('should throw ApiError with status code for HTTP errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not Found' }
        },
        message: 'Request failed with status code 404'
      }

      ;(apiClient.request as jest.Mock).mockRejectedValueOnce(mockError)

      try {
        await callApi('getUser', { id: 1 })
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).statusCode).toBe(404)
      }
    })
  })
}) 