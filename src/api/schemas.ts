import { z } from 'zod'

// 기본 사용자 스키마
export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  role: z.enum(['admin', 'user'] as const),
  createdAt: z.string().datetime()
})

// 사용자 생성 스키마
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true
})

// 사용자 수정 스키마
export const updateUserSchema = createUserSchema.partial()

// 사용자 목록 응답 스키마
export const getUsersResponseSchema = z.object({
  items: z.array(userSchema),
  total: z.number()
})

// API 응답 스키마
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional()
})

// 타입 추출
export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type GetUsersResponse = z.infer<typeof getUsersResponseSchema> 