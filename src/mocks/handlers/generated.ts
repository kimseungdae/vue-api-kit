import { http } from 'msw'
import { apiMap } from '../../definitions/apiMap'
import { generateMSWHandler } from '../utils/generateMSWHandler'

// API 핸들러 생성
const handlers = Object.entries(apiMap).map(([key, spec]) => {
  const handler = generateMSWHandler(key, spec)
  return http[spec.method.toLowerCase()](spec.path, handler)
})

console.log(
  '[MSW] Generated handlers:',
  handlers.map(h => `${h.info.method} ${h.info.path}`)
)

export default handlers 