import { HttpResponse, type DefaultBodyType, HttpHandler } from 'msw'
import type { ApiSpec } from '../../types/apiSpec'
import { generateMockData } from './generateMockData'

/**
 * API 스펙으로부터 MSW 핸들러를 생성합니다.
 * @param key API 식별자
 * @param spec API 스펙 객체
 * @returns MSW 핸들러
 */
export function generateMSWHandler(key: string, spec: ApiSpec<any, any>) {
  return async ({ request }: { request: Request & { params?: Record<string, string> } }) => {
    try {
      console.log('[MSW] 요청 수신:', {
        key,
        method: spec.method,
        path: spec.path,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries())
      })

      // URL 파라미터 추출
      const url = new URL(request.url)
      const params = Object.fromEntries(url.searchParams)

      // 요청 본문 파싱
      let requestBody = {}
      if (spec.method !== 'GET') {
        try {
          requestBody = await request.json()
          console.log('[MSW] 요청 본문:', requestBody)
        } catch (e) {
          console.warn('[MSW] 요청 본문 파싱 실패:', e)
        }
      }

      console.log('[MSW] 요청 파라미터:', {
        query: params,
        body: requestBody
      })

      // 모의 데이터 생성
      let mockData
      if (spec.path === '/users') {
        if (spec.method === 'GET') {
          const page = Number(params.page) || 1
          const limit = Number(params.limit) || 10
          const items = Array.from({ length: limit }, () => 
            generateMockData(spec.responseSchema.shape.items.element)
          )
          mockData = {
            items,
            total: 100
          }
        } else if (spec.method === 'POST') {
          // 새 사용자 생성
          mockData = {
            id: Math.floor(Math.random() * 1000) + 1,
            ...requestBody,
            createdAt: new Date().toISOString()
          }
        }
      } else if (!spec.responseSchema) {
        throw new Error('Response schema is required')
      } else {
        mockData = generateMockData(spec.responseSchema)
      }

      console.log('[MSW] 생성된 응답 데이터:', {
        key,
        mockData,
        schema: spec.responseSchema?.toString()
      })

      // 응답 데이터 검증
      if (spec.responseSchema) {
        const validationResult = spec.responseSchema.safeParse(mockData)
        if (!validationResult.success) {
          console.error('[MSW] 응답 데이터 검증 실패:', {
            key,
            error: validationResult.error,
            data: mockData
          })
          throw new Error('Generated mock data does not match schema')
        }
      }

      return HttpResponse.json(mockData, {
        status: spec.method === 'POST' ? 201 : 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('[MSW] 핸들러 오류:', error)

      return HttpResponse.json(
        {
          message: 'Internal Server Error',
          error: error instanceof Error ? error.message : String(error)
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }
} 