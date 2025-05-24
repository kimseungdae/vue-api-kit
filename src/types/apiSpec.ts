import { z } from 'zod'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface ApiSpec<
  TResponse extends z.ZodTypeAny,
  TRequest extends z.ZodTypeAny | null = null,
  TParams extends Record<string, string | number> = Record<string, string | number>,
  TQuery extends Record<string, any> = Record<string, any>
> {
  method: HttpMethod
  path: string
  responseSchema: TResponse
  requestSchema?: TRequest
  params?: TParams
  query?: TQuery
  description?: string
} 