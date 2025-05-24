require('@testing-library/jest-dom')
const { config } = require('@vue/test-utils')

// Vue Test Utils 설정
config.global.mocks = {
  $t: (key) => key,
  $route: {
    params: {},
    query: {}
  }
}

// Vue 컴포넌트 경고 무시
config.global.config.warnHandler = () => null 