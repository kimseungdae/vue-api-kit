import { z } from 'zod'
import { generateMockData, generateMockArray, generateMockPagination } from '../generateMockData'

describe('generateMockData', () => {
  const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    age: z.number().min(0).max(120),
    isActive: z.boolean()
  })

  it('should generate mock data based on schema', () => {
    const mockUser = generateMockData(userSchema)

    expect(mockUser).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.stringMatching(/@/),
      age: expect.any(Number),
      isActive: expect.any(Boolean)
    }))

    expect(mockUser.age).toBeGreaterThanOrEqual(0)
    expect(mockUser.age).toBeLessThanOrEqual(120)
  })

  it('should generate array of mock data', () => {
    const count = 5
    const mockUsers = generateMockArray(userSchema, count)

    expect(mockUsers).toHaveLength(count)
    mockUsers.forEach(user => {
      expect(user).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.stringMatching(/@/),
        age: expect.any(Number),
        isActive: expect.any(Boolean)
      }))
    })
  })

  it('should generate paginated mock data', () => {
    const page = 2
    const perPage = 5
    const totalItems = 13
    const result = generateMockPagination(userSchema, page, perPage, totalItems)

    // 두 번째 페이지는 5개의 아이템을 가져야 함
    expect(result.items).toHaveLength(5)
    
    // 페이지네이션 정보 확인
    expect(result.pagination).toEqual({
      page: 2,
      perPage: 5,
      totalItems: 13,
      totalPages: 3
    })

    // 각 아이템이 스키마를 따르는지 확인
    result.items.forEach(user => {
      expect(user).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.stringMatching(/@/),
        age: expect.any(Number),
        isActive: expect.any(Boolean)
      }))
    })
  })

  it('should handle last page with fewer items', () => {
    const page = 3
    const perPage = 5
    const totalItems = 13
    const result = generateMockPagination(userSchema, page, perPage, totalItems)

    // 마지막 페이지는 3개의 아이템만 있어야 함
    expect(result.items).toHaveLength(3)
    
    expect(result.pagination).toEqual({
      page: 3,
      perPage: 5,
      totalItems: 13,
      totalPages: 3
    })
  })
}) 