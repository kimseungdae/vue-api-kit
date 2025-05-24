import { useApi } from '../useApi'
import { callApi } from '../../api/callApi'
import { ApiError } from '../../core/errors'

// API 호출 모킹
jest.mock('../../api/callApi')

describe('useApi', () => {
  const mockError = new ApiError('API Error', 500)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch data successfully', async () => {
    const mockData = {
      id: 1,
      name: 'John',
      email: 'john@example.com'
    }

    ;(callApi as jest.Mock).mockResolvedValueOnce(mockData)

    const { data, error, loading, refetch } = useApi('getUsers')
    await refetch()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toEqual(mockData)
    expect(callApi).toHaveBeenCalledWith('getUsers', undefined)
  })

  it('should handle error', async () => {
    ;(callApi as jest.Mock).mockRejectedValueOnce(mockError)

    const { data, error, loading, refetch } = useApi('getUsers')
    await expect(refetch()).rejects.toThrow(mockError)

    expect(loading.value).toBe(false)
    expect(error.value).toBe(mockError)
    expect(data.value).toBeNull()
  })

  it('should fetch data with initial params', async () => {
    const mockData = {
      id: 1,
      name: 'John',
      email: 'john@example.com'
    }

    const initialParams = { page: 1, limit: 10 }
    ;(callApi as jest.Mock).mockResolvedValueOnce(mockData)

    const { data, error, loading } = useApi('getUsers', initialParams)

    // 비동기 작업 완료 대기
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toEqual(mockData)
    expect(callApi).toHaveBeenCalledWith('getUsers', initialParams)
  })

  it('should update loading state during fetch', async () => {
    const mockResponse = { users: [] }
    ;(callApi as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { loading, refetch } = useApi('getUsers')

    const fetchPromise = refetch()
    expect(loading.value).toBe(true)

    await fetchPromise
    expect(loading.value).toBe(false)
  })
}) 