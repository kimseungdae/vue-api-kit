import { z } from 'zod'
import { generateMarkdownDoc } from '../generateMarkdownDoc'
import type { ApiSpec } from '../../../types/apiSpec'

describe('generateMarkdownDoc', () => {
  // 테스트용 스키마 정의
  const userResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email()
  })

  const userRequestSchema = z.object({
    id: z.number()
  })

  it('should generate markdown with both request and response schemas', () => {
    const spec: ApiSpec<typeof userResponseSchema, typeof userRequestSchema> = {
      method: 'GET',
      path: '/users/:id',
      description: '사용자 정보 조회',
      responseSchema: userResponseSchema,
      requestSchema: userRequestSchema
    }

    const markdown = generateMarkdownDoc('getUser', spec)

    // 기본 구조 검증
    expect(markdown).toContain('## GET /users/:id')
    expect(markdown).toContain('**키:** `getUser`')
    expect(markdown).toContain('**설명:** 사용자 정보 조회')
    
    // 요청/응답 스키마 섹션 검증
    expect(markdown).toContain('### 🟦 요청(Request)')
    expect(markdown).toContain('### 🟩 응답(Response)')
    
    // JSON 스키마 포함 여부 검증
    expect(markdown).toContain('"type": "object"')
    expect(markdown).toContain('"properties"')
    expect(markdown).toContain('"id"')
    expect(markdown).toContain('"email"')
  })

  it('should handle missing request schema', () => {
    const spec: ApiSpec<typeof userResponseSchema> = {
      method: 'GET',
      path: '/users',
      description: '사용자 목록 조회',
      responseSchema: userResponseSchema
    }

    const markdown = generateMarkdownDoc('getUsers', spec)

    // 요청 스키마가 없는 경우 '없음' 표시
    expect(markdown).toContain('```json\n없음\n```')
  })

  it('should handle missing description', () => {
    const spec: ApiSpec<typeof userResponseSchema> = {
      method: 'GET',
      path: '/users',
      responseSchema: userResponseSchema
    }

    const markdown = generateMarkdownDoc('getUsers', spec)

    // 설명이 없는 경우 '설명 없음' 표시
    expect(markdown).toContain('**설명:** 설명 없음')
  })
}) 