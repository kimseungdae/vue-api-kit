import { ZodError } from 'zod'
import { AxiosError } from 'axios'
import { apiMap } from '../../definitions/apiMap'
import { apiClient } from '../axios/instance'
import type { ApiSpec } from '../../types/apiSpec'
import type { RequestParams, ResponseData } from '../../types/apiCall'
import { replacePathParams, separateParams } from './utils'
import { ApiCache } from '../cache/apiCache'
import {
  ApiError,
  MissingPathParamError,
  RequestValidationError,
  ResponseValidationError
} from '../errors'

const cache = new ApiCache()

/**
 * API를 호출하는 함수
 * @param key API 식별자
 * @param params 요청 파라미터
 * @returns 응답 데이터
 */
export async function callApi<
  TSpec extends ApiSpec<any, any>,
  TParams extends RequestParams<TSpec>,
  TResponse extends ResponseData<TSpec>
>(key: keyof typeof apiMap, params?: TParams): Promise<TResponse> {
  try {
    const spec = apiMap[key]
    const { method, path, requestSchema, responseSchema } = spec

    // 경로 파라미터 추출 및 검증
    try {
      const { pathParams, queryParams, bodyParams } = separateParams(path, params || {})
      const url = replacePathParams(path, pathParams)

      // 요청 데이터 검증
      if (params && requestSchema) {
        try {
          requestSchema.parse(params)
        } catch (error) {
          if (error instanceof ZodError) {
            throw new RequestValidationError(error)
          }
          throw error
        }
      }

      // API 호출
      const response = await apiClient.request({
        method,
        url,
        params: queryParams,
        data: bodyParams
      })

      // 응답 데이터 검증
      if (responseSchema) {
        const parsed = responseSchema.safeParse(response.data)
        if (!parsed.success) {
          throw new ResponseValidationError(key as string, parsed.error, response.data)
        }
        return parsed.data as TResponse
      }

      return response.data as TResponse
    } catch (error) {
      if (error instanceof Error && error.message.includes('Missing required path parameter')) {
        const paramName = error.message.split(': ')[1]
        throw new MissingPathParamError(paramName)
      }
      throw error
    }
  } catch (error) {
    if (
      error instanceof RequestValidationError ||
      error instanceof ResponseValidationError ||
      error instanceof MissingPathParamError ||
      error instanceof ApiError
    ) {
      throw error
    }

    if (error instanceof AxiosError || (error && typeof error === 'object' && 'isAxiosError' in error)) {
      const axiosError = error as AxiosError
      const statusCode = axiosError.response?.status || 500
      const message = axiosError.response?.data?.message || axiosError.message
      throw new ApiError(message, statusCode, axiosError.response?.data)
    }

    throw new ApiError('API 호출 중 예상치 못한 오류가 발생했습니다.', 500)
  }
}

/**
 * API 호출 함수 (타입 추론 헬퍼)
 */
export function createApiCaller<
  TKey extends keyof typeof apiMap,
  TSpec extends ApiSpec<any, any> = (typeof apiMap)[TKey]
>(key: TKey) {
  return (params?: RequestParams<TSpec>) => callApi(key, params)
} 