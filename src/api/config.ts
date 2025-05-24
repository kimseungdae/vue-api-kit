import axios from 'axios'
import { setupResponseInterceptor, setupRequestInterceptor } from './interceptors'

// API 클라이언트 생성
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 인터셉터 설정
setupRequestInterceptor(apiClient)
setupResponseInterceptor(apiClient)

export const API_CONFIG = {
  baseURL: '/api',
  endpoints: {
    users: '/users'
  }
} as const 