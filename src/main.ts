import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initMockWorker } from './mocks/browser'

const app = createApp(App)

// MSW 초기화
initMockWorker().catch(console.error)

app.mount('#app') 