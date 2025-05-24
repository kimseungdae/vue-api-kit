import { z } from 'zod'
import { paginationRequestSchema, sortRequestSchema, searchFilterSchema, createPaginatedResponse } from '../common/base.schema'

// 사용자 기본 스키마 (재사용 가능한 형태로)
export const userBaseSchema = z.object({
  id: z.number().int().positive().describe('사용자 ID'),
  name: z.string().min(1).max(50).describe('사용자 이름'),
  email: z.string().email().describe('이메일 주소'),
  createdAt: z.string().datetime().describe('생성일시')
})

// 요청 스키마 (페이지네이션 + 정렬 + 검색)
export const listUsersRequestSchema = z.object({
  ...paginationRequestSchema.shape,
  ...sortRequestSchema.shape,
  ...searchFilterSchema.shape,
  status: z.enum(['active', 'inactive', 'all']).optional().default('all').describe('사용자 상태 필터'),
  role: z.enum(['admin', 'user', 'all']).optional().default('all').describe('사용자 역할 필터')
})

// 응답 스키마 (페이지네이션 포함)
export const listUsersResponseSchema = createPaginatedResponse(userBaseSchema)

// 타입 추론
export type ListUsersRequest = z.infer<typeof listUsersRequestSchema>
export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>
export type UserBase = z.infer<typeof userBaseSchema> 