import { http, HttpResponse, delay } from 'msw'
import { faker } from '@faker-js/faker/locale/ko'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

// 초기 사용자 데이터
let users: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'user'] as const),
  createdAt: faker.date.past().toISOString()
}))

// MSW 핸들러
export const handlers = [
  // 사용자 목록 조회
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const role = url.searchParams.get('role')

    let filteredUsers = users
    if (role) {
      filteredUsers = users.filter(user => user.role === role)
    }

    const start = (page - 1) * limit
    const end = start + limit
    const items = filteredUsers.slice(start, end)

    await delay(300)
    return HttpResponse.json({
      items,
      total: filteredUsers.length
    })
  }),

  // 단일 사용자 조회
  http.get('/api/users/:id', async ({ params }) => {
    const { id } = params
    const user = users.find(u => u.id === Number(id))

    await delay(300)
    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(user)
  }),

  // 사용자 생성
  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as Omit<User, 'id' | 'createdAt'>
    const newUser: User = {
      id: users.length + 1,
      ...body,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    await delay(300)
    return HttpResponse.json(newUser)
  }),

  // 사용자 수정
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as Partial<Omit<User, 'id' | 'createdAt'>>
    const userIndex = users.findIndex(u => u.id === Number(id))

    await delay(300)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    users[userIndex] = {
      ...users[userIndex],
      ...body
    }

    return HttpResponse.json(users[userIndex])
  }),

  // 사용자 삭제
  http.delete('/api/users/:id', async ({ params }) => {
    const { id } = params
    const userIndex = users.findIndex(u => u.id === Number(id))

    await delay(300)
    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    users = users.filter(u => u.id !== Number(id))

    return HttpResponse.json({ success: true })
  })
] 