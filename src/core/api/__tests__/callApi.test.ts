import { z } from 'zod'
import { apiClient } from '../../axios/instance'
import { callApi } from '../callApi'
import { ApiError, MissingPathParamError, RequestValidationError } from '../../errors'
import { AxiosError } from 'axios'

// Mock API Map
jest.mock('../../../definitions/apiMap', () => ({
  apiMap: {
    getUser: {
      method: 'GET',
      path: '/users/:id',
      requestSchema: z.object({
        id: z.number()
      }),
      responseSchema: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.enum(['admin', 'user']),
        createdAt: z.string()
      })
    }
  }
}))

// Mock Axios Client
jest.mock('../../axios/instance')

describe('callApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('성공 케이스', () => {
    it('should make GET request with path parameters', async () => {
      const mockResponse = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'user',
        createdAt: '2024-02-20'
      }

      ;(apiClient.request as jest.Mock).mockResolvedValueOnce({
        data: mockResponse
      })

      const result = await callApi('getUser', { id: 1 })

      expect(apiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users/1',
        params: {},
        data: {}
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('에러 케이스', () => {
    it('should throw MissingPathParamError when path parameter is missing', async () => {
      await expect(callApi('getUser', {})).rejects.toThrow(MissingPathParamError)
    })

    it('should throw RequestValidationError for invalid request data', async () => {
      await expect(callApi('getUser', { id: 'invalid' })).rejects.toThrow(RequestValidationError)
    })

    it('should throw ApiError with status code for HTTP errors', async () => {
      const mockError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      } as AxiosError

      ;(apiClient.request as jest.Mock).mockRejectedValueOnce(mockError)

      try {
        await callApi('getUser', { id: 1 })
        fail('Expected error to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).statusCode).toBe(404)
        expect((error as ApiError).message).toBe('Not Found')
      }
    })
  })
}) 