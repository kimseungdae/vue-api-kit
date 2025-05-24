import { z } from 'zod'
import type { Ref } from 'vue'
import type { ApiSpec } from './apiSpec'

/**
 * API 호출 결과 상태
 */
export interface ApiCallState<TData> {
  data: Ref<TData | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
}

/**
 * API 호출 결과 (상태 + 재시도 함수)
 */
export interface ApiCallResult<TData> extends ApiCallState<TData> {
  refetch: () => Promise<TData>
}

/**
 * API 호출 옵션
 */
export interface ApiCallOptions {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
}

/**
 * API 호출 에러
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * API 스펙으로부터 요청 파라미터 타입 추출
 */
export type RequestParams<TSpec extends ApiSpec<any, any>> =
  TSpec['requestSchema'] extends z.ZodType ? z.infer<TSpec['requestSchema']> : void

/**
 * API 스펙으로부터 응답 데이터 타입 추출
 */
export type ResponseData<TSpec extends ApiSpec<any, any>> =
  TSpec['responseSchema'] extends z.ZodType ? z.infer<TSpec['responseSchema']> : never 