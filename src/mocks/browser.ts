import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW Worker 인스턴스
 * 생성된 모든 핸들러를 포함하여 설정
 */
export const worker = setupWorker(...handlers)

// worker 설정
const initMockWorker = async () => {
  console.log('[MSW] 초기화 시작', {
    NODE_ENV: process.env.NODE_ENV,
    VITE_ENABLE_MSW: process.env.VITE_ENABLE_MSW,
    hostname: window.location.hostname,
    mode: import.meta.env.MODE
  })

  // 개발 환경이나 preview 모드, 또는 MSW가 활성화된 경우에 실행
  if (
    process.env.NODE_ENV === 'development' ||
    import.meta.env.MODE === 'preview' ||
    process.env.VITE_ENABLE_MSW === 'true'
  ) {
    try {
      await worker.start({
        onUnhandledRequest: (request, print) => {
          // API 요청에 대해서만 경고 표시
          if (request.url.pathname.startsWith('/api/')) {
            print.warning()
          }
        },
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      })
      console.log('[MSW] Mock Service Worker 활성화됨')
    } catch (error) {
      console.error('[MSW] Mock Service Worker 초기화 실패:', error)
    }
  } else {
    console.log('[MSW] Mock Service Worker 비활성화 (프로덕션 모드)')
  }
}

export { initMockWorker } 