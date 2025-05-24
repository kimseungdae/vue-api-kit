import { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class RequestValidationError extends Error {
  constructor(public error: ZodError) {
    super(error.message)
    this.name = 'RequestValidationError'
  }
}

export class ResponseValidationError extends Error {
  constructor(
    public apiKey: string,
    public error: ZodError,
    public data: unknown
  ) {
    super(`API '${apiKey}' 응답이 스키마와 일치하지 않습니다:\n${error.message}`)
    this.name = 'ResponseValidationError'
  }
}

export class MissingPathParamError extends Error {
  constructor(public paramName: string) {
    super(`필수 경로 파라미터가 누락되었습니다: ${paramName}`)
    this.name = 'MissingPathParamError'
  }
} 