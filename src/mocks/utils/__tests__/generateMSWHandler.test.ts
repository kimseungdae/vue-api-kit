import { generateMSWHandler } from '../generateMSWHandler'
import { z } from 'zod'
import { http, HttpResponse } from 'msw'

describe('generateMSWHandler', () => {
  const mockSpec = {
    method: 'GET' as const,
    path: '/test',
    responseSchema: z.object({
      id: z.number(),
      name: z.string()
    })
  }

  it('should generate a valid MSW handler', async () => {
    const handler = generateMSWHandler('test', mockSpec)
    const response = await handler({ request: new Request('http://localhost/test') })

    expect(response instanceof HttpResponse).toBe(true)
    const data = await response.json()
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('name')
  })

  it('should handle errors gracefully', async () => {
    const mockErrorSpec = {
      method: 'GET' as const,
      path: '/error',
      responseSchema: undefined
    }

    const handler = generateMSWHandler('error', mockErrorSpec)
    const response = await handler({ request: new Request('http://localhost/error') })

    expect(response instanceof HttpResponse).toBe(true)
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty('message', 'Internal Server Error')
    expect(data).toHaveProperty('error')
  })
}) 