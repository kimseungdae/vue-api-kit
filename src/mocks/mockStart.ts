import { worker } from './browser'

/**
 * 개발 환경에서 MSW Mock 서버를 시작하는 함수
 */
export async function startMockWorker() {
  if (import.meta.env.MODE === 'development') {
    await worker.start({
      onUnhandledRequest: 'bypass', // 실서버 요청은 통과시킴
    })
    console.info('🧪 MSW mock server started!')
  }
} 