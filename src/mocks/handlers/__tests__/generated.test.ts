import { handlers } from '../generated'
import { apiMap } from '../../../definitions/apiMap'

describe('generated handlers', () => {
  it('should generate handlers for all APIs in apiMap', () => {
    expect(handlers).toHaveLength(Object.keys(apiMap).length)
  })

  it('should have correct method and path for each handler', () => {
    Object.entries(apiMap).forEach(([key, spec], index) => {
      const handler = handlers[index]
      expect(handler.info.method).toBe(spec.method)
      expect(handler.info.path).toBe(spec.path)
    })
  })
}) 