import { UrlPresetConfig, UrlBuilderOptions, UrlParams, QueryParams, UrlSegment } from './types'

export class UrlBuilder {
  private _segments: UrlSegment[] = []
  private _params: UrlParams = {}
  private queryParams: QueryParams = {}
  private config: Required<UrlPresetConfig>

  constructor(preset: UrlPresetConfig) {
    this.config = {
      baseUrl: preset.baseUrl.replace(/\/$/, ''), // 끝의 슬래시 제거
      version: preset.version ?? '',
      prefix: preset.prefix ?? ''
    }
  }

  // 세그먼트 추가
  segment(value: UrlSegment): this {
    this._segments.push(value)
    return this
  }

  // 여러 세그먼트 추가
  addSegments(...values: UrlSegment[]): this {
    this._segments.push(...values)
    return this
  }

  // URL 파라미터 설정
  param(key: string, value: string | number): this {
    this._params[key] = value
    return this
  }

  // 여러 URL 파라미터 설정
  setParams(params: UrlParams): this {
    Object.assign(this._params, params)
    return this
  }

  // 쿼리 파라미터 설정
  query(key: string, value: QueryParams[string]): this {
    this.queryParams[key] = value
    return this
  }

  // 여러 쿼리 파라미터 설정
  queries(params: QueryParams): this {
    Object.assign(this.queryParams, params)
    return this
  }

  // URL 생성
  build(options: UrlBuilderOptions = {}): string {
    const {
      baseUrl = this.config.baseUrl,
      version = this.config.version,
      prefix = this.config.prefix,
      trailingSlash = false,
      encodeParams = true
    } = options

    // 기본 URL 구성
    let url = baseUrl

    // API 버전 추가
    if (version) {
      url += `/v${version}`
    }

    // 접두사 추가
    if (prefix) {
      url += `/${prefix}`
    }

    // 세그먼트 추가
    if (this._segments.length > 0) {
      url += `/${this._segments.join('/')}`
    }

    // URL 파라미터 치환
    let finalUrl = url
    Object.entries(this._params).forEach(([key, value]) => {
      const paramValue = encodeParams ? encodeURIComponent(String(value)) : String(value)
      finalUrl = finalUrl.replace(new RegExp(`:${key}\\??`), paramValue)
    })

    // 쿼리 파라미터 추가
    const queryString = this.buildQueryString(this.queryParams, encodeParams)
    if (queryString) {
      finalUrl = finalUrl.replace(/\?+$/, '') // 끝의 물음표 제거
      finalUrl += `?${queryString}`
    }

    // 끝의 슬래시 처리
    if (trailingSlash && !finalUrl.endsWith('/')) {
      finalUrl += '/'
    }

    return finalUrl
  }

  // 쿼리 스트링 생성 유틸리티
  private buildQueryString(params: QueryParams, encode: boolean): string {
    const queryParts = Object.entries(params)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => {
        const encodedKey = encode ? encodeURIComponent(key) : key
        
        if (Array.isArray(value)) {
          return value
            .map(v => `${encodedKey}[]=${encode ? encodeURIComponent(String(v)) : v}`)
            .join('&')
        }
        
        const encodedValue = encode ? encodeURIComponent(String(value)) : value
        return `${encodedKey}=${encodedValue}`
      })
      .filter(Boolean)

    return queryParts.join('&')
  }

  // 빌더 초기화
  reset(): this {
    this._segments = []
    this._params = {}
    this.queryParams = {}
    return this
  }
} 