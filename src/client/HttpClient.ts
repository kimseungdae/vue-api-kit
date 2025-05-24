import { z } from 'zod'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>
  query?: Record<string, string | string[]>
  data?: unknown
}

export interface ResponseConfig<T> {
  schema?: z.ZodType<T>
  raw?: boolean
}

export interface HttpClientConfig {
  baseURL: string
  headers?: Record<string, string>
  timeout?: number
}

export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
  onRequestError?: (error: unknown) => Promise<unknown>
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: Response, config: ResponseConfig<T>) => Promise<T> | T
  onResponseError?: (error: unknown) => Promise<unknown>
}

export class HttpError extends Error {
  public data?: unknown

  constructor(
    public readonly response: Response,
    data?: unknown
  ) {
    super(`HTTP Error ${response.status}: ${response.statusText}`)
    this.name = 'HttpError'
    this.data = data
  }
}

export class HttpClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(private readonly config: HttpClientConfig) {}

  // 인터셉터 등록
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  // HTTP 메서드 구현
  async get<T>(url: string, config?: RequestConfig, responseConfig?: ResponseConfig<T>): Promise<T> {
    return this.request<T>('GET', url, config, responseConfig)
  }

  async post<T>(url: string, config?: RequestConfig, responseConfig?: ResponseConfig<T>): Promise<T> {
    return this.request<T>('POST', url, config, responseConfig)
  }

  async put<T>(url: string, config?: RequestConfig, responseConfig?: ResponseConfig<T>): Promise<T> {
    return this.request<T>('PUT', url, config, responseConfig)
  }

  async delete<T>(url: string, config?: RequestConfig, responseConfig?: ResponseConfig<T>): Promise<T> {
    return this.request<T>('DELETE', url, config, responseConfig)
  }

  async patch<T>(url: string, config?: RequestConfig, responseConfig?: ResponseConfig<T>): Promise<T> {
    return this.request<T>('PATCH', url, config, responseConfig)
  }

  // 요청 처리
  private async request<T>(
    method: HttpMethod,
    url: string,
    config: RequestConfig = {},
    responseConfig: ResponseConfig<T> = {}
  ): Promise<T> {
    // 기본 설정과 병합
    const mergedConfig: RequestConfig = {
      ...config,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...config.headers
      }
    }

    // 요청 데이터 처리
    if (config.data) {
      mergedConfig.body = JSON.stringify(config.data)
    }

    // URL 파라미터와 쿼리 문자열 처리
    const fullUrl = this.buildUrl(url, config.params, config.query)

    try {
      // 요청 인터셉터 실행
      let finalConfig = mergedConfig
      for (const interceptor of this.requestInterceptors) {
        if (interceptor.onRequest) {
          finalConfig = await interceptor.onRequest(finalConfig)
        }
      }

      // 요청 실행
      const response = await this.fetchWithTimeout(fullUrl, finalConfig)

      // 응답 처리
      let result = await this.handleResponse(response, responseConfig)

      // 응답 인터셉터 실행
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onResponse) {
          result = await interceptor.onResponse(response, responseConfig)
        }
      }

      return result
    } catch (error) {
      // 에러 처리
      return this.handleError(error)
    }
  }

  // URL 생성
  private buildUrl(
    url: string,
    params?: Record<string, string>,
    query?: Record<string, string | string[]>
  ): string {
    let fullUrl = `${this.config.baseURL}${url}`

    // URL 파라미터 치환
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fullUrl = fullUrl.replace(`:${key}`, encodeURIComponent(value))
      })
    }

    // 쿼리 문자열 추가
    if (query) {
      const queryString = Object.entries(query)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value
              .map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`)
              .join('&')
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        })
        .join('&')

      if (queryString) {
        fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    return fullUrl
  }

  // 타임아웃 처리
  private async fetchWithTimeout(
    url: string,
    config: RequestConfig
  ): Promise<Response> {
    if (!this.config.timeout) {
      return fetch(url, config)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // 응답 처리
  private async handleResponse<T>(
    response: Response,
    config: ResponseConfig<T>
  ): Promise<T> {
    // 에러 응답 처리
    if (!response.ok) {
      const error = new HttpError(response)
      try {
        error.data = await response.json()
      } catch {
        // JSON 파싱 실패는 무시
      }
      throw error
    }

    // Raw 응답 반환
    if (config.raw) {
      return response as unknown as T
    }

    // JSON 응답 처리
    const data = await response.json()

    // 스키마 검증
    if (config.schema) {
      return config.schema.parse(data)
    }

    return data
  }

  // 에러 처리
  private async handleError<T>(error: unknown): Promise<T> {
    // 요청 에러 인터셉터 실행
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequestError) {
        try {
          return (await interceptor.onRequestError(error)) as T
        } catch (e) {
          error = e
        }
      }
    }

    // 응답 에러 인터셉터 실행
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponseError) {
        try {
          return (await interceptor.onResponseError(error)) as T
        } catch (e) {
          error = e
        }
      }
    }

    throw error
  }
} 