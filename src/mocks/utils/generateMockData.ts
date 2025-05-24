import { z } from 'zod'
import { generateMock } from '@anatine/zod-mock'

/**
 * Zod 스키마를 기반으로 mock 데이터를 생성하는 유틸리티 함수
 * @param schema Zod 스키마
 * @returns 스키마 타입에 맞는 mock 데이터
 */
export function generateMockData<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  return generateMock(schema)
}

/**
 * 배열 형태의 mock 데이터를 생성하는 유틸리티 함수
 * @param schema Zod 스키마
 * @param count 생성할 아이템 개수 (기본값: 3)
 * @returns 스키마 타입에 맞는 mock 데이터 배열
 */
export function generateMockArray<T extends z.ZodTypeAny>(
  schema: T,
  count: number = 3
): z.infer<T>[] {
  return Array.from({ length: count }, () => generateMock(schema))
}

/**
 * 페이지네이션된 응답 형태의 mock 데이터를 생성하는 유틸리티 함수
 * @param schema Zod 스키마
 * @param page 현재 페이지 (기본값: 1)
 * @param perPage 페이지당 아이템 수 (기본값: 10)
 * @param totalItems 전체 아이템 수 (기본값: 100)
 * @returns 페이지네이션 정보가 포함된 mock 데이터
 */
export function generateMockPagination<T extends z.ZodTypeAny>(
  schema: T,
  page: number = 1,
  perPage: number = 10,
  totalItems: number = 100
): {
  items: z.infer<T>[]
  pagination: {
    page: number
    perPage: number
    totalItems: number
    totalPages: number
  }
} {
  const totalPages = Math.ceil(totalItems / perPage)
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const itemsToGenerate = Math.min(perPage, totalItems - (currentPage - 1) * perPage)

  return {
    items: generateMockArray(schema, itemsToGenerate),
    pagination: {
      page: currentPage,
      perPage,
      totalItems,
      totalPages
    }
  }
} 