import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

/**
 * Zod 스키마를 JSON Schema 형식으로 변환하는 유틸리티 함수
 * @param schema Zod 스키마
 * @returns JSON Schema 객체
 */
export function convertZodToJson(schema: z.ZodTypeAny): object {
  return zodToJsonSchema(schema, {
    name: 'Schema', // 스키마 이름 설정
    target: 'jsonSchema7', // JSON Schema draft-07 형식 사용
  })
}

/**
 * Zod 스키마를 예쁘게 포맷팅된 JSON 문자열로 변환
 * @param schema Zod 스키마
 * @returns 포맷팅된 JSON 문자열
 */
export function convertZodToJsonString(schema: z.ZodTypeAny): string {
  const jsonSchema = convertZodToJson(schema)
  return JSON.stringify(jsonSchema, null, 2)
} 