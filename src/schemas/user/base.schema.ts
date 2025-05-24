import { z } from 'zod'

// 사용자 상태 enum
export const userStatusSchema = z.enum(['active', 'inactive', 'all'])

// 사용자 역할 enum
export const userRoleSchema = z.enum(['admin', 'user', 'all'])

// 사용자 기본 스키마
export const userBaseSchema = z.object({
  id: z.number().int().positive().describe('User ID'),
  name: z.string().min(1).max(50).describe('Name'),
  email: z.string().email().describe('Email address'),
  createdAt: z.string().datetime().describe('Created at'),
})

// 사용자 생성용 기본 스키마
export const userCreateBaseSchema = userBaseSchema.omit({ 
  id: true, 
  createdAt: true 
}).extend({
  password: z.string().min(8).max(100).describe('Password')
})

// 사용자 수정용 기본 스키마
export const userUpdateBaseSchema = userBaseSchema.partial().pick({
  name: true,
  email: true
})

// 사용자 필터 기본 스키마
export const userFilterBaseSchema = z.object({
  status: userStatusSchema.optional().default('all'),
  role: userRoleSchema.optional().default('all')
}) 