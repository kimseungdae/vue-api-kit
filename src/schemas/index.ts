// 공통 스키마 export
export * from './common/base.schema'

// 도메인별 스키마 export
export * from './user'

// 스키마 유틸리티
import { z } from 'zod'

// 공통 응답 래퍼 스키마
export const apiResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    data: schema,
    status: z.number().int(),
    message: z.string().optional()
  })

// 공통 에러 스키마
export const apiErrorSchema = z.object({
  status: z.number().int(),
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional()
})

// API 메서드 enum
export const httpMethodSchema = z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']) 