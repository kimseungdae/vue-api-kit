import type { ApiKey, ApiRequest, ApiResponse } from '../types/apiSpec'
import type { ApiError } from '../core/api/errors'
import type { Ref } from 'vue'
import type { ApiSpec } from '../types/apiSpec'
import type { RequestParams, ResponseData } from '../types/apiCall'
import type { CacheOptions } from '../core/cache/types'
import { apiMap } from '../definitions/apiMap'

/**
 * useApi 옵션
 */
export interface UseApiOptions<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
> extends CacheOptions {
  /**
   * API 요청 파라미터
   */
  params?: RequestParams<TSpec>

  /**
   * 컴포넌트 마운트 시 자동으로 API를 호출할지 여부
   * @default true
   */
  immediate?: boolean

  /**
   * params가 변경될 때마다 자동으로 API를 호출할지 여부
   * @default false
   */
  watch?: boolean

  /**
   * API 호출 성공 시 실행할 콜백
   */
  onSuccess?: (data: ResponseData<TSpec>) => void

  /**
   * API 호출 실패 시 실행할 콜백
   */
  onError?: (error: ApiError) => void
}

/**
 * useApi 반환 타입
 */
export interface UseApiReturn<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
> {
  /**
   * API 응답 데이터
   */
  data: Ref<ResponseData<TSpec> | null>

  /**
   * API 호출 에러
   */
  error: Ref<ApiError | null>

  /**
   * API 호출 중 여부
   */
  loading: Ref<boolean>

  /**
   * API 재호출 함수
   */
  refetch: (params?: RequestParams<TSpec>) => Promise<void>
}

/**
 * useMutation 옵션
 */
export interface UseMutationOptions<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
> {
  /**
   * 초기 파라미터 (immediate가 true일 때 사용)
   */
  params?: RequestParams<TSpec>

  /**
   * 컴포넌트 마운트 시 자동으로 mutation을 실행할지 여부
   * @default false
   */
  immediate?: boolean

  /**
   * 수동 실행 모드 (immediate 무시)
   * @default true
   */
  manual?: boolean

  /**
   * mutation 성공 시 실행할 콜백
   */
  onSuccess?: (data: ResponseData<TSpec>) => void

  /**
   * mutation 실패 시 실행할 콜백
   */
  onError?: (error: ApiError) => void

  /**
   * mutation 메타데이터 (추적, 컨텍스트 등)
   */
  meta?: any
}

/**
 * useMutation 반환값
 */
export interface UseMutationReturn<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
> {
  /**
   * mutation 응답 데이터
   */
  data: Ref<ResponseData<TSpec> | null>

  /**
   * mutation 에러
   */
  error: Ref<ApiError | null>

  /**
   * mutation 진행 중 여부
   */
  loading: Ref<boolean>

  /**
   * mutation 실행 함수
   */
  mutate: (params: RequestParams<TSpec>) => Promise<ResponseData<TSpec>>

  /**
   * mutation 상태 초기화
   */
  reset: () => void
} 