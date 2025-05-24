// Vite 환경 변수 모킹
process.env.VITE_API_BASE_URL = 'http://localhost:3000'

// import.meta 모킹
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
      MODE: 'test'
    }
  }
}

// Vue 컴포저블 모킹
global.vi = {
  fn: jest.fn
}

// MSW 모킹
global.fetch = jest.fn()
global.Headers = jest.fn()
global.Request = jest.fn()
global.Response = jest.fn()

// Vue 컴포넌트 모킹
jest.mock('vue', () => {
  const mockRef = jest.fn((x) => ({ value: x }))
  const mockComputed = jest.fn()
  const mockWatch = jest.fn()
  const mockOnMounted = jest.fn()
  const mockOnUnmounted = jest.fn()

  return {
    ref: mockRef,
    computed: mockComputed,
    watch: mockWatch,
    onMounted: mockOnMounted,
    onUnmounted: mockOnUnmounted
  }
}) 