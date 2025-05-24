import { z } from 'zod'

// 페이지네이션 요청 스키마
export const paginationRequestSchema = z.object({
  page: z.number().int().min(1).default(1).describe('페이지 번호'),
  limit: z.number().int().min(1).max(100).default(20).describe('페이지당 항목 수')
})

// 페이지네이션 응답 메타 스키마
export const paginationMetaSchema = z.object({
  currentPage: z.number().int().min(1).describe('현재 페이지'),
  totalPages: z.number().int().min(1).describe('전체 페이지 수'),
  totalItems: z.number().int().min(0).describe('전체 항목 수'),
  itemsPerPage: z.number().int().min(1).describe('페이지당 항목 수')
})

// 페이지네이션된 응답 래퍼 스키마
export const createPaginatedResponse = <T extends z.ZodType>(schema: T) => 
  z.object({
    items: z.array(schema),
    meta: paginationMetaSchema
  })

// 기본 정렬 스키마
export const sortRequestSchema = z.object({
  sortBy: z.string().optional().describe('정렬 기준 필드'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc').describe('정렬 방향')
})

// 검색 필터 스키마
export const searchFilterSchema = z.object({
  keyword: z.string().optional().describe('검색 키워드'),
  fields: z.array(z.string()).optional().describe('검색 대상 필드')
})

// 타입 추론
export type PaginationRequest = z.infer<typeof paginationRequestSchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>
export type SortRequest = z.infer<typeof sortRequestSchema>
export type SearchFilter = z.infer<typeof searchFilterSchema> 