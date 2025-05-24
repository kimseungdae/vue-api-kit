// 기본 스키마 export
export * from './base.schema'

// API 스키마 export
export * from './api.schema'

// 타입 추론
import { z } from 'zod'
import type { InferSchema } from '../../types/common.types'
import {
  getUserRequestSchema,
  getUserResponseSchema,
  createUserRequestSchema,
  createUserResponseSchema,
  updateUserRequestSchema,
  updateUserResponseSchema,
  deleteUserRequestSchema,
  deleteUserResponseSchema,
  listUsersRequestSchema,
  listUsersResponseSchema
} from './api.schema'
import {
  userStatusSchema,
  userRoleSchema,
  userBaseSchema,
  userCreateBaseSchema,
  userUpdateBaseSchema,
  userFilterBaseSchema
} from './base.schema'

// API 요청/응답 타입
export type GetUserRequest = InferSchema<typeof getUserRequestSchema>
export type GetUserResponse = InferSchema<typeof getUserResponseSchema>
export type CreateUserRequest = InferSchema<typeof createUserRequestSchema>
export type CreateUserResponse = InferSchema<typeof createUserResponseSchema>
export type UpdateUserRequest = InferSchema<typeof updateUserRequestSchema>
export type UpdateUserResponse = InferSchema<typeof updateUserResponseSchema>
export type DeleteUserRequest = InferSchema<typeof deleteUserRequestSchema>
export type DeleteUserResponse = InferSchema<typeof deleteUserResponseSchema>
export type ListUsersRequest = InferSchema<typeof listUsersRequestSchema>
export type ListUsersResponse = InferSchema<typeof listUsersResponseSchema>

// 기본 타입
export type UserStatus = z.infer<typeof userStatusSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type UserBase = z.infer<typeof userBaseSchema>
export type UserCreateBase = z.infer<typeof userCreateBaseSchema>
export type UserUpdateBase = z.infer<typeof userUpdateBaseSchema>
export type UserFilterBase = z.infer<typeof userFilterBaseSchema> 