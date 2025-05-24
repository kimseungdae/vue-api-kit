// URL 파라미터 타입
export type UrlParams = Record<string, string | number>

// URL 쿼리 파라미터 타입
export type QueryParams = Record<string, string | number | boolean | Array<string | number> | null | undefined>

// URL 프리셋 설정 타입
export interface UrlPresetConfig {
  baseUrl: string
  version?: string | number
  prefix?: string
}

// URL 빌더 옵션 타입
export interface UrlBuilderOptions {
  // 기본 설정
  baseUrl?: string
  version?: string | number
  prefix?: string
  
  // 파라미터
  params?: UrlParams
  query?: QueryParams
  
  // 추가 옵션
  trailingSlash?: boolean
  encodeParams?: boolean
}

// URL 세그먼트 타입
export type UrlSegment = string | number

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API 엔드포인트 설정 타입
export interface ApiEndpointConfig {
  method: HttpMethod
  path: string
  description?: string
} 