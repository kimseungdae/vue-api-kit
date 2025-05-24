import { z } from 'zod'
import type { ApiSpec } from '../types/apiSpec'

// 사용자 스키마
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  createdAt: z.string()
})

// API 맵 정의
export const apiMap: Record<string, ApiSpec<any, any>> = {
  // 사용자 목록 조회
  getUsers: {
    method: 'GET',
    path: '/users',
    description: '사용자 목록 조회',
    requestSchema: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      role: z.enum(['admin', 'user']).optional()
    }),
    responseSchema: z.object({
      items: z.array(userSchema),
      total: z.number()
    })
  },

  // 단일 사용자 조회
  getUser: {
    method: 'GET',
    path: '/users/:id',
    description: '사용자 정보 조회',
    requestSchema: z.object({
      id: z.number()
    }),
    responseSchema: userSchema
  },

  // 사용자 생성
  createUser: {
    method: 'POST',
    path: '/users',
    description: '새 사용자 생성',
    requestSchema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      role: z.enum(['admin', 'user'])
    }),
    responseSchema: userSchema
  },

  // 사용자 수정
  updateUser: {
    method: 'PUT',
    path: '/users/:id',
    description: '사용자 정보 수정',
    requestSchema: z.object({
      id: z.number(),
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      role: z.enum(['admin', 'user']).optional()
    }),
    responseSchema: userSchema
  },

  // 사용자 삭제
  deleteUser: {
    method: 'DELETE',
    path: '/users/:id',
    description: '사용자 삭제',
    requestSchema: z.object({
      id: z.number()
    }),
    responseSchema: z.object({
      success: z.boolean()
    })
  }
} 