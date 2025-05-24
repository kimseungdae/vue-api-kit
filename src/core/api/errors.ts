import { ZodError } from 'zod'
import type { ApiErrorResponse } from '../axios/types'

/**
 * API 에러 기본 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: ApiErrorResponse
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 요청 파라미터 검증 에러
 */
export class RequestValidationError extends ApiError {
  constructor(public zodError: ZodError) {
    const message = formatZodError(zodError)
    super(message)
    this.name = 'RequestValidationError'
  }
}

/**
 * 응답 데이터 검증 에러
 */
export class ResponseValidationError extends ApiError {
  constructor(
    public apiKey: string,
    public zodError: ZodError,
    public rawData: unknown
  ) {
    const message = `API '${apiKey}' 응답이 스키마와 일치하지 않습니다:\n${formatZodError(zodError)}`
    super(message)
    this.name = 'ResponseValidationError'
  }
}

/**
 * 경로 파라미터 누락 에러
 */
export class MissingPathParamError extends ApiError {
  constructor(paramName: string) {
    super(`필수 경로 파라미터가 누락되었습니다: ${paramName}`)
    this.name = 'MissingPathParamError'
  }
}

/**
 * Zod 에러 메시지를 사용자 친화적으로 포맷팅
 */
function formatZodError(error: ZodError): string {
  return error.issues
    .map(issue => {
      const path = issue.path.join('.')
      const prefix = path ? `${path}: ` : ''
      return `${prefix}${issue.message}`
    })
    .join('\n')
} 