import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiErrorResponse } from './types'
import { ApiError } from '../../types/apiCall'

/**
 * 요청 인터셉터
 */
export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  // 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

/**
 * 요청 에러 인터셉터
 */
export function requestErrorInterceptor(error: AxiosError): Promise<never> {
  console.error('🔥 Request Error:', error.message)
  return Promise.reject(new ApiError(error.message))
}

/**
 * 응답 인터셉터
 */
export function responseInterceptor<T>(response: AxiosResponse<T>): T {
  // 응답 데이터만 반환
  return response.data
}

/**
 * 응답 에러 인터셉터
 */
export function responseErrorInterceptor(error: AxiosError<ApiErrorResponse>): Promise<never> {
  const errorResponse = error.response?.data
  const message = errorResponse?.message || error.message || '알 수 없는 오류가 발생했습니다.'
  const statusCode = error.response?.status

  // 에러 로깅
  console.error('🔥 API Error:', {
    status: statusCode,
    message,
    details: errorResponse
  })

  // 401 에러 처리 (인증 만료)
  if (statusCode === 401) {
    localStorage.removeItem('access_token')
    // TODO: 로그인 페이지로 리다이렉트 또는 토큰 갱신 로직
  }

  return Promise.reject(new ApiError(message, statusCode, errorResponse))
} 