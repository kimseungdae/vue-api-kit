import { setupWorker } from 'msw/browser'
import handlers from './handlers/generated'

/**
 * MSW Worker 인스턴스
 * 생성된 모든 핸들러를 포함하여 설정
 */
export const worker = setupWorker(...handlers)

// worker 설정
const initMockWorker = async () => {
  if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    await worker.start({
      onUnhandledRequest: 'bypass'
    })
    console.log('[MSW] Mock Service Worker 활성화됨')
  }
}

export { initMockWorker } 