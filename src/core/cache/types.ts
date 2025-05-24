/**
 * 캐시 키 타입
 */
export type CacheKey = string

/**
 * 캐시 값 타입
 */
export interface CacheValue<T = unknown> {
  /**
   * 캐시된 데이터
   */
  data: T

  /**
   * 만료 시간 (timestamp)
   */
  expiry: number
}

/**
 * 캐시 옵션
 */
export interface CacheOptions {
  /**
   * 캐시 TTL (ms)
   * @default 3000
   */
  ttl?: number

  /**
   * 캐시 사용 여부
   * @default true
   */
  enabled?: boolean
}

/**
 * 캐시 설정
 */
export interface CacheConfig {
  /**
   * 기본 TTL (ms)
   * @default 3000
   */
  defaultTTL: number

  /**
   * 캐시 자동 정리 간격 (ms)
   * @default 60000
   */
  cleanupInterval: number
} 