// 공통 타입 export
export * from './common.types'

// 도메인별 타입 export
export * from './user.types'

// 스키마 공통 타입 export
export * from '../schemas/common/base.schema'

// 향후 다른 도메인 타입들도 여기서 export
// export * from './post.types'
// export * from './comment.types'

// 타입 유틸리티 함수
import { z } from 'zod'
import type { InferSchema } from './common.types'

// 스키마로부터 요청/응답 타입 추출 유틸리티
export function getRequestType<T extends z.ZodType>(schema: T): InferSchema<T> {
  return {} as InferSchema<T>
}

export function getResponseType<T extends z.ZodType>(schema: T): InferSchema<T> {
  return {} as InferSchema<T>
} 