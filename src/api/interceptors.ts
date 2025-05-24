import type { AxiosInstance, AxiosError } from 'axios'
import { ApiError } from '../core/errors'

export const setupRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      // 요청 전처리
      return config
    },
    (error: AxiosError) => {
      console.error('🔥 Request Error:', error.message)
      return Promise.reject(error)
    }
  )
}

export const setupResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => {
      // 응답 후처리
      return response
    },
    (error: AxiosError) => {
      console.error('🔥 API Error:', {
        statusCode: error.response?.status,
        message: error.message,
        details: error.response?.data?.message || ''
      })

      throw new ApiError(
        'API 호출 중 예상치 못한 오류가 발생했습니다.',
        error.response?.status || 500,
        error.response?.data?.message
      )
    }
  )
} 