import { z } from 'zod'
import { convertZodToJson, convertZodToJsonString } from '../zodToJson'

describe('zodToJson utilities', () => {
  const testSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    age: z.number().optional(),
    role: z.enum(['admin', 'user']).optional()
  })

  describe('convertZodToJson', () => {
    it('should convert Zod schema to JSON Schema object', () => {
      const result = convertZodToJson(testSchema)
      
      expect(result).toEqual({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: '#/definitions/Schema',
        definitions: {
          Schema: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'name', 'email'],
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              age: { type: 'number' },
              role: { 
                type: 'string',
                enum: ['admin', 'user']
              }
            }
          }
        }
      })
    })
  })

  describe('convertZodToJsonString', () => {
    it('should convert Zod schema to formatted JSON string', () => {
      const result = convertZodToJsonString(testSchema)
      
      // JSON 문자열을 파싱하여 객체로 변환 후 검증
      const parsed = JSON.parse(result)
      expect(parsed).toEqual({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: '#/definitions/Schema',
        definitions: {
          Schema: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'name', 'email'],
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              age: { type: 'number' },
              role: { 
                type: 'string',
                enum: ['admin', 'user']
              }
            }
          }
        }
      })

      // 포맷팅 검증 (줄바꿈과 들여쓰기)
      expect(result).toContain('\n')
      expect(result).toContain('  ')
    })
  })
}) 