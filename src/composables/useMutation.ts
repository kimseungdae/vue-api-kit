import { ref } from 'vue'
import { callApi } from '../core/api/callApi'
import type { ApiSpec } from '../types/apiSpec'
import type { RequestParams, ResponseData } from '../types/apiCall'
import type { ApiError } from '../core/api/errors'
import type { UseMutationOptions, UseMutationReturn } from './types'
import { apiMap } from '../definitions/apiMap'

/**
 * Mutation 상태를 관리하는 composable
 * @param key API 키
 * @param options 옵션
 */
export function useMutation<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
>(
  key: TKey,
  options: UseMutationOptions<TKey, TSpec> = {}
): UseMutationReturn<TKey, TSpec> {
  const {
    params: initialParams,
    immediate = false,
    manual = true,
    onSuccess,
    onError,
    meta
  } = options

  // 상태 관리
  const data = ref<ResponseData<TSpec> | null>(null)
  const error = ref<ApiError | null>(null)
  const loading = ref(false)

  /**
   * mutation 실행 함수
   */
  const mutate = async (params: RequestParams<TSpec>): Promise<ResponseData<TSpec>> => {
    loading.value = true
    error.value = null

    try {
      const result = await callApi(key, params)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (err: any) {
      error.value = err
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 상태 초기화
   */
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  // 즉시 실행 설정 (manual이 false이고 immediate가 true이며 초기 파라미터가 있는 경우)
  if (!manual && immediate && initialParams) {
    mutate(initialParams).catch(() => {
      // 초기 실행 에러는 무시 (이미 error 상태에 저장됨)
    })
  }

  return {
    mutate,
    data,
    error,
    loading,
    reset
  }
}

/**
 * Mutation 상태를 관리하는 composable (타입 추론 헬퍼)
 */
export function createMutationHook<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
>(key: TKey) {
  return (options?: UseMutationOptions<TKey, TSpec>) => useMutation(key, options)
} 