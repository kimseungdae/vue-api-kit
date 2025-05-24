import { z } from 'zod'

// 기본 API 응답 타입
export type ApiResponse<T> = {
  data: T
  status: number
  message?: string
}

// API 에러 타입
export type ApiError = {
  status: number
  message: string
  code?: string
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' 