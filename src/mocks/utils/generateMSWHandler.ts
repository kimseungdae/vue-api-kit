import { HttpResponse } from 'msw'
import { ApiSpec } from '../../types/api'
import { generateMockData } from './generateMockData'

/**
 * API 스펙으로부터 MSW 핸들러를 생성합니다.
 * @param key API 식별자
 * @param spec API 스펙
 * @returns MSW 핸들러
 */
export function generateMSWHandler(key: string, spec: ApiSpec<any, any>) {
  return async () => {
    try {
      const mockData = generateMockData(spec.responseSchema)
      return new HttpResponse(JSON.stringify(mockData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Internal Server Error',
          error: error instanceof Error ? error.message : String(error)
        }),
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