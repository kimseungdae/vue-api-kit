import { z } from 'zod'
import { paginationRequestSchema, sortRequestSchema, searchFilterSchema, createPaginatedResponse } from '../common/base.schema'
import { userBaseSchema, userCreateBaseSchema, userUpdateBaseSchema, userFilterBaseSchema } from './base.schema'
import { apiResponseSchema } from '../index'

// GET /users/:id
export const getUserRequestSchema = z.object({
  id: z.number().int().positive()
})
export const getUserResponseSchema = apiResponseSchema(userBaseSchema)

// POST /users
export const createUserRequestSchema = userCreateBaseSchema
export const createUserResponseSchema = apiResponseSchema(userBaseSchema)

// PUT /users/:id
export const updateUserRequestSchema = z.object({
  id: z.number().int().positive()
}).merge(userUpdateBaseSchema)
export const updateUserResponseSchema = apiResponseSchema(userBaseSchema)

// DELETE /users/:id
export const deleteUserRequestSchema = z.object({
  id: z.number().int().positive()
})
export const deleteUserResponseSchema = apiResponseSchema(z.object({
  success: z.boolean(),
  message: z.string(),
  deletedId: z.number().int().positive()
}))

// GET /users
export const listUsersRequestSchema = z.object({
  ...paginationRequestSchema.shape,
  ...sortRequestSchema.shape,
  ...searchFilterSchema.shape,
  ...userFilterBaseSchema.shape
})
export const listUsersResponseSchema = apiResponseSchema(
  createPaginatedResponse(userBaseSchema)
) 