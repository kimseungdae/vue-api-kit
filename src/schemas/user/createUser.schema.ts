import { z } from 'zod'
import { userBaseSchema } from './listUsers.schema'

// 요청 스키마
export const createUserRequestSchema = z.object({
  name: z.string().min(1).max(50).describe('사용자 이름'),
  email: z.string().email().describe('이메일 주소'),
  password: z.string().min(8).max(100).describe('비밀번호')
})

// 응답 스키마
export const createUserResponseSchema = userBaseSchema

// 타입 추론
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>
export type CreateUserResponse = z.infer<typeof createUserResponseSchema> 