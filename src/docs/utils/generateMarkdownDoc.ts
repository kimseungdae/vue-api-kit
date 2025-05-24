import { convertZodToJson } from './zodToJson'
import type { ApiSpec } from '../../types/apiSpec'

/**
 * API 스펙 객체를 Markdown 문서로 변환하는 함수
 * @param key API 식별자
 * @param spec API 스펙 객체
 * @returns Markdown 형식의 문자열
 */
export function generateMarkdownDoc(
  key: string,
  spec: ApiSpec<any, any>
): string {
  try {
    const { method, path, description, requestSchema, responseSchema } = spec

    // 요청 스키마가 있는 경우에만 JSON으로 변환
    const requestJsonSchema = requestSchema
      ? JSON.stringify(convertZodToJson(requestSchema), null, 2)
      : '없음'

    // 응답 스키마는 항상 필수
    const responseJsonSchema = JSON.stringify(convertZodToJson(responseSchema), null, 2)

    return `## ${method} ${path}

**키:** \`${key}\`  
**설명:** ${description || '설명 없음'}

### 🟦 요청(Request)
\`\`\`json
${requestJsonSchema}
\`\`\`

### 🟩 응답(Response)
\`\`\`json
${responseJsonSchema}
\`\`\`
---`
  } catch (error) {
    console.error(`❌ ${key} API 문서 생성 중 오류 발생:`, error)
    throw error
  }
} 