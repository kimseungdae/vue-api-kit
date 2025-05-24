import { z } from 'zod'

// API 응답 래퍼 타입
export type ApiWrapper<T> = {
  data: T
  status: number
  message?: string
}

// API 에러 타입
export type ApiError = {
  status: number
  message: string
  code?: string
  details?: Record<string, unknown>
}

// API 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Zod 스키마 타입 추출 유틸리티
export type InferSchema<T extends z.ZodType> = z.infer<T>

// 페이지네이션된 응답 타입
export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

// ID 기반 요청 파라미터 타입
export type IdParam = {
  id: number
}

// 기본 정렬 방향 타입
export type SortDirection = 'asc' | 'desc'

// 검색 가능한 필드 타입
export type Searchable<T> = {
  [K in keyof T]?: boolean
}

// 날짜 범위 필터 타입
export type DateRangeFilter = {
  startDate?: string
  endDate?: string
} 