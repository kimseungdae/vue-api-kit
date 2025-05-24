import { http } from 'msw'
import { apiMap } from '../../definitions/apiMap'
import { generateMSWHandler } from '../utils/generateMSWHandler'

// API 핸들러 생성
const handlers = Object.entries(apiMap).map(([key, spec]) => {
  const handler = generateMSWHandler(key, spec)
  const path = `/api${spec.path}`
  const method = spec.method.toLowerCase() as Lowercase<typeof spec.method>
  const httpHandler = http[method](path, handler)
  return {
    ...httpHandler,
    info: {
      method: spec.method,
      path
    }
  }
})

console.log(
  '[MSW] Generated handlers:',
  handlers.map(h => `${h.info.method} ${h.info.path}`)
)

export { handlers }
export default handlers 