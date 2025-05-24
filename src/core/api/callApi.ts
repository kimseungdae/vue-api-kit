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
 * @returns API 응답
 */
export async function callApi(key: keyof typeof apiMap, params?: any) {
  const spec = apiMap[key]
  if (!spec) {
    throw new ApiError(`API "${key}" not found`, 404)
  }

  try {
    // URL 파라미터 처리
    const { pathParams, queryParams } = separateParams(spec.path, params || {})
    
    // 필수 경로 파라미터 검증
    const requiredParams = spec.path.match(/:[^/]+/g)?.map(p => p.slice(1)) || []
    const missingParams = requiredParams.filter(p => !(p in pathParams))
    if (missingParams.length > 0) {
      throw new MissingPathParamError(missingParams[0])
    }

    // 요청 파라미터 검증
    if (spec.requestSchema) {
      try {
        const validationResult = spec.requestSchema.safeParse(params)
        if (!validationResult.success) {
          throw new RequestValidationError(validationResult.error)
        }
      } catch (error) {
        if (error instanceof ZodError) {
          throw new RequestValidationError(error)
        }
        throw error
      }
    }

    const url = replacePathParams(spec.path, pathParams)

    // 요청 URL 및 파라미터 로깅
    const requestConfig = {
      method: spec.method,
      url,
      data: spec.method !== 'GET' ? params : {},
      params: spec.method === 'GET' ? queryParams : undefined
    }

    console.log('[API] 요청 정보:', {
      key,
      spec,
      requestConfig,
      params
    })

    // API 호출
    const response = await apiClient.request(requestConfig)

    // 응답 데이터 검증
    console.log('[API] 응답 데이터:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      responseSchema: spec.responseSchema?.toString()
    })

    // Zod 스키마 검증
    if (spec.responseSchema) {
      try {
        const validationResult = spec.responseSchema.safeParse(response.data)
        console.log('[API] 응답 데이터 검증 결과:', validationResult)
        
        if (!validationResult.success) {
          throw new ResponseValidationError(key, validationResult.error, response.data)
        }
        return validationResult.data
      } catch (validationError) {
        console.error('[API] 응답 데이터 검증 실패:', {
          error: validationError,
          data: response.data
        })
        throw validationError
      }
    }

    return response.data
  } catch (error) {
    // 상세 에러 정보 로깅
    console.error('[API] 호출 실패:', {
      key,
      spec,
      error,
      isAxiosError: error instanceof AxiosError,
      status: error instanceof AxiosError ? error.response?.status : undefined,
      statusText: error instanceof AxiosError ? error.response?.statusText : undefined,
      responseData: error instanceof AxiosError ? error.response?.data : undefined,
      message: error instanceof Error ? error.message : String(error)
    })

    // 이미 처리된 에러는 그대로 전달
    if (error instanceof MissingPathParamError ||
        error instanceof RequestValidationError ||
        error instanceof ResponseValidationError) {
      throw error
    }

    // Axios 에러는 ApiError로 변환
    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        throw new ApiError(axiosError.response.data?.message || 'Not Found', axiosError.response.status)
      }
      throw new ApiError(axiosError.message || 'API Error', 500)
    }

    // 기타 에러는 원본 에러 메시지를 유지
    if (error instanceof Error) {
      throw error
    }

    throw new ApiError('Unexpected API error', 500, { originalError: String(error) })
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