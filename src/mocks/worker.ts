import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// MSW 워커 설정
export const worker = setupWorker(...handlers)

// 개발 환경에서만 MSW 시작
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass'
  })
} 