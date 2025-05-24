import axios from 'axios'
import type { ApiClientConfig } from './types'
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor
} from './interceptors'

/**
 * API 클라이언트 인스턴스 생성
 */
export function createApiClient(config: ApiClientConfig) {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 7000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    }
  })

  // 인터셉터 설정
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  )

  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  )

  return instance
}

// 기본 API 클라이언트 인스턴스
export const apiClient = createApiClient({
  baseURL: process.env.VITE_API_BASE_URL || '/api'
}) 