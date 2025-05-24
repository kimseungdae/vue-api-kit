import { z } from 'zod'
import { userBaseSchema } from './listUsers.schema'

// 요청 스키마
export const getUserRequestSchema = z.object({
  id: z.number().int().positive().describe('사용자 ID')
})

// 응답 스키마
export const getUserResponseSchema = userBaseSchema

// 타입 추론
export type GetUserRequest = z.infer<typeof getUserRequestSchema>
export type GetUserResponse = z.infer<typeof getUserResponseSchema> 