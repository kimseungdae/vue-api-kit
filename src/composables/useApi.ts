import { ref, watchEffect, type Ref } from 'vue'
import { callApi } from '../api/callApi'
import { ApiError } from '../core/errors'
import type { ApiSpec } from '../types/apiSpec'
import type { RequestParams, ResponseData } from '../types/apiCall'
import type { ApiKey, ApiRequest, ApiResponse } from '../types/apiSpec'
import type { UseApiOptions, UseApiReturn } from './types'
import { apiCache } from '../core/cache/apiCache'
import { API_ENDPOINTS } from '../api/callApi'

/**
 * API 호출을 위한 컴포저블
 * @param key API 식별자
 * @param initialParams 초기 파라미터
 * @returns API 호출 관련 상태와 함수
 */
export function useApi<T extends keyof typeof API_ENDPOINTS>(
  key: T,
  initialParams?: any
) {
  const data = ref<any | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  /**
   * 데이터를 가져오는 함수
   * @param params 요청 파라미터
   */
  const refetch = async (params?: any): Promise<any> => {
    loading.value = true
    error.value = null

    try {
      data.value = await callApi(key, params)
      return data.value
    } catch (err) {
      error.value = err instanceof ApiError ? err : new ApiError('API Error', 500)
      data.value = null
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * 데이터를 변경하는 함수
   * @param params 요청 파라미터
   */
  async function mutate(params: any) {
    loading.value = true
    error.value = null

    try {
      data.value = await callApi(key, params)
    } catch (err) {
      error.value = err instanceof ApiError ? err : new ApiError('API Error')
      data.value = null
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // 초기 데이터 로드
  if (initialParams) {
    refetch(initialParams)
  }

  return {
    data,
    error,
    loading,
    refetch,
    mutate
  }
}

/**
 * API 호출 상태를 관리하는 composable (타입 추론 헬퍼)
 */
export function createApiHook<K extends ApiKey>(key: K) {
  return (options?: UseApiOptions<K>) => useApi(key, options)
}

export function useMutation<T>(
  apiKey: Parameters<typeof callApi>[0]
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // 데이터 변경
  async function mutate(params?: Parameters<typeof callApi>[1]) {
    try {
      loading.value = true
      error.value = null
      data.value = await callApi(apiKey, params)
      return data.value
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    mutate
  }
} 