import { setupServer } from 'msw/node'
import { handlers } from './handlers/generated'

/**
 * Node.js 환경용 MSW 서버 인스턴스
 * 테스트 등에서 사용 가능
 */
export const server = setupServer(...handlers) 