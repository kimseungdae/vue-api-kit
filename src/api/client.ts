import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { ApiError, type ApiCallOptions } from '../types/apiCall'

/**
 * axios 인스턴스 생성 함수
 */
export function createApiClient(options: ApiCallOptions = {}): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL || '/api',
    timeout: options.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      // 여기에 토큰 주입 등의 로직 추가 가능
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(createApiError(error))
    }
  )

  // 응답 인터셉터
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data
    },
    (error: AxiosError) => {
      return Promise.reject(createApiError(error))
    }
  )

  return client
}

/**
 * API 에러 생성 함수
 */
function createApiError(error: AxiosError): ApiError {
  const statusCode = error.response?.status
  const message = error.response?.data?.message as string || error.message || '알 수 없는 오류가 발생했습니다.'
  
  return new ApiError(message, statusCode, error.response?.data)
}

// 기본 API 클라이언트 인스턴스
export const apiClient = createApiClient() 