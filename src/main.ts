import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initMockWorker } from './mocks/browser'

const app = createApp(App)

// MSW 초기화
if (process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_MSW === 'true') {
  initMockWorker().catch(error => {
    console.error('[MSW] 초기화 실패:', error)
  })
}

app.mount('#app') 