import type { CacheKey, CacheValue, CacheConfig } from './types'
import type { ApiKey } from '../../types/apiSpec'
import type { RequestParams } from '../../types/apiCall'

/**
 * 기본 캐시 설정
 */
const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 3000, // 기본 3초
  cleanupInterval: 60000 // 1분마다 정리
}

interface CacheItem<T> {
  data: T
  expiry: number | null
}

/**
 * API 응답 캐시 관리자
 */
export class ApiCache {
  private cache: Map<string, CacheItem<any>>
  private cleanupTimer: NodeJS.Timeout | null = null
  private config: CacheConfig

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.cache = new Map()
    this.startCleanup()
  }

  /**
   * 캐시 키 생성
   */
  private createKey(key: ApiKey, params: unknown): CacheKey {
    return `${key}:${JSON.stringify(params)}`
  }

  /**
   * 캐시 데이터 설정
   * @param ttl TTL이 0이면 캐시하지 않음
   */
  set<T>(key: string, data: T, ttl?: number) {
    const expiry = ttl ? Date.now() + ttl : null
    this.cache.set(key, { data, expiry })
  }

  /**
   * 캐시 데이터 조회
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 캐시 데이터 삭제
   */
  delete(key: ApiKey, params: unknown): void {
    const cacheKey = this.createKey(key, params)
    this.cache.delete(cacheKey)
  }

  /**
   * 특정 API 키에 대한 모든 캐시 삭제
   */
  deleteByKey(key: ApiKey): void {
    const prefix = `${key}:`
    for (const cacheKey of this.cache.keys()) {
      if (cacheKey.startsWith(prefix)) {
        this.cache.delete(cacheKey)
      }
    }
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 만료된 캐시 정리
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now >= value.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 자동 정리 시작
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  /**
   * 자동 정리 중지
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }
}

/**
 * 기본 캐시 인스턴스
 */
export const apiCache = new ApiCache()

/**
 * 특정 키와 파라미터에 대한 캐시 무효화
 */
export function invalidateCacheByKey<K extends ApiKey>(
  key: K,
  params: RequestParams<K>
): void {
  apiCache.delete(key, params)
}

/**
 * 특정 API 키에 대한 모든 캐시 무효화
 */
export function invalidateAllCacheByKey(key: ApiKey): void {
  apiCache.deleteByKey(key)
}

/**
 * 모든 캐시 무효화
 */
export function clearAllCache(): void {
  apiCache.clear()
}

/**
 * 캐시 키 생성 (외부 사용용)
 */
export function getCacheKey(key: ApiKey, params: unknown): string {
  return `${key}:${JSON.stringify(params)}`
} 