import axios from 'axios'

/**
 * API 클라이언트 인스턴스
 */
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}) 