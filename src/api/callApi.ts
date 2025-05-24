import { z } from 'zod'
import { apiClient } from './config'
import type { AxiosError } from 'axios'
import {
  ApiError,
  ResponseValidationError,
  RequestValidationError,
  MissingPathParamError
} from '../core/errors'
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  getUsersResponseSchema,
  apiResponseSchema
} from './schemas'

// API 설정
export const API_ENDPOINTS = {
  getUsers: '/users',
  getUser: (id: number) => `/users/${id}`,
  createUser: '/users',
  updateUser: (id: number) => `/users/${id}`,
  deleteUser: (id: number) => `/users/${id}`
} as const

// API 설정 타입
const API_CONFIG = {
  getUsers: {
    method: 'GET',
    schema: z.object({}),
    responseSchema: getUsersResponseSchema
  },
  getUser: {
    method: 'GET',
    schema: z.object({ id: z.number() }),
    responseSchema: userSchema
  },
  createUser: {
    method: 'POST',
    schema: createUserSchema,
    responseSchema: userSchema
  },
  updateUser: {
    method: 'PUT',
    schema: updateUserSchema,
    responseSchema: userSchema
  },
  deleteUser: {
    method: 'DELETE',
    schema: z.object({ id: z.number() }),
    responseSchema: z.object({})
  }
} as const

export type { ApiError, ResponseValidationError, RequestValidationError, MissingPathParamError }

export async function callApi<T extends keyof typeof API_ENDPOINTS>(
  apiKey: T,
  params?: any
): Promise<any> {
  try {
    const config = API_CONFIG[apiKey]

    // 경로 파라미터 검증
    if (typeof API_ENDPOINTS[apiKey] === 'function') {
      if (!params?.id) {
        throw new MissingPathParamError('id')
      }
    }

    // 요청 데이터 검증
    if (params) {
      try {
        config.schema.parse(params)
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new RequestValidationError(error)
        }
        throw error
      }
    }

    // 엔드포인트 생성
    const endpoint = typeof API_ENDPOINTS[apiKey] === 'function'
      ? (API_ENDPOINTS[apiKey] as Function)(params!.id)
      : API_ENDPOINTS[apiKey]

    // API 호출
    const response = await apiClient.request({
      method: config.method,
      url: endpoint,
      params: config.method === 'GET' ? params : undefined,
      data: config.method !== 'GET' ? params : undefined
    })

    // 응답 데이터 검증
    try {
      return config.responseSchema.parse(response.data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ResponseValidationError(apiKey, error, response.data)
      }
      throw error
    }
  } catch (error) {
    if (
      error instanceof ApiError ||
      error instanceof ResponseValidationError ||
      error instanceof RequestValidationError ||
      error instanceof MissingPathParamError
    ) {
      throw error
    }

    // Axios 에러 처리
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as AxiosError
      throw new ApiError(
        axiosError.message,
        axiosError.response?.status || 500,
        axiosError.response?.data
      )
    }

    throw new ApiError('API 호출 중 예상치 못한 오류가 발생했습니다.')
  }
} 