import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * API 응답 데이터 기본 구조
 */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  error?: string
}

/**
 * API 에러 응답 구조
 */
export interface ApiErrorResponse {
  message: string
  code?: string
  details?: unknown
}

/**
 * 인터셉터 핸들러 타입
 */
export interface InterceptorHandlers {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onRequestError?: (error: AxiosError) => Promise<never>
  onResponse?: <T>(response: AxiosResponse<T>) => T | Promise<T>
  onResponseError?: (error: AxiosError<ApiErrorResponse>) => Promise<never>
}

/**
 * API 클라이언트 설정
 */
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
} 