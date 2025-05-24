import { useApi } from '../useApi'
import { callApi } from '../../api/callApi'
import { ApiError } from '../../core/errors'

// API 호출 모킹
jest.mock('../../api/callApi')

describe('useMutation', () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  }

  const mockError = new ApiError('API Error', 500)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should mutate data successfully', async () => {
    const mockResponse = {
      id: 1,
      ...userData
    }

    ;(callApi as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { data, error, loading, mutate } = useApi('createUser')
    await mutate(userData)

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toEqual(mockResponse)
    expect(callApi).toHaveBeenCalledWith('createUser', userData)
  })

  it('should handle error', async () => {
    ;(callApi as jest.Mock).mockRejectedValueOnce(mockError)

    const { data, error, loading, mutate } = useApi('createUser')

    await expect(mutate(userData)).rejects.toThrow(mockError)

    expect(loading.value).toBe(false)
    expect(error.value).toBe(mockError)
    expect(data.value).toBeNull()
  })

  it('should update loading state during mutation', async () => {
    const mockResponse = {
      id: 1,
      ...userData
    }

    let resolvePromise: (value: unknown) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    ;(callApi as jest.Mock).mockImplementationOnce(() => promise)

    const { loading, mutate } = useApi('createUser')
    const mutatePromise = mutate(userData)

    expect(loading.value).toBe(true)

    resolvePromise!(mockResponse)
    await mutatePromise

    expect(loading.value).toBe(false)
  })
}) 