/**
 * URL 경로의 파라미터를 실제 값으로 치환
 * @example
 * replacePathParams('/users/:id', { id: 1 }) => '/users/1'
 */
export function replacePathParams(path: string, params: Record<string, any>): string {
  return path.replace(/:[a-zA-Z][a-zA-Z0-9]*/g, match => {
    const paramName = match.slice(1)
    const value = params[paramName]
    if (value === undefined) {
      throw new Error(`Missing required path parameter: ${paramName}`)
    }
    return String(value)
  })
}

/**
 * 경로 파라미터 키를 추출
 * @example
 * extractPathParams('/users/:id') => ['id']
 */
export function extractPathParams(path: string): string[] {
  const matches = path.match(/:([a-zA-Z]+)/g) || []
  return matches.map(param => param.slice(1))
}

/**
 * URL 경로에서 파라미터 이름을 추출합니다.
 * @param path URL 경로
 * @returns 파라미터 이름 배열
 */
function extractPathParamNames(path: string): string[] {
  const matches = path.match(/:[a-zA-Z][a-zA-Z0-9]*/g) || []
  return matches.map(param => param.slice(1))
}

/**
 * 파라미터를 경로 파라미터와 나머지로 분리합니다.
 * @param path URL 경로
 * @param params 전체 파라미터
 * @returns 분리된 파라미터
 */
export function separateParams(path: string, params: Record<string, any>) {
  const pathParamNames = extractPathParamNames(path)
  const pathParams: Record<string, any> = {}
  const queryParams: Record<string, any> = {}
  const bodyParams: Record<string, any> = {}

  // 파라미터 분리
  for (const [key, value] of Object.entries(params)) {
    if (pathParamNames.includes(key)) {
      if (value === undefined) {
        throw new Error(`Missing required path parameter: ${key}`)
      }
      pathParams[key] = value
    } else if (key === 'query') {
      Object.assign(queryParams, value)
    } else if (key === 'body') {
      Object.assign(bodyParams, value)
    } else {
      queryParams[key] = value
    }
  }

  // 필수 경로 파라미터 검증
  for (const name of pathParamNames) {
    if (!(name in pathParams)) {
      throw new Error(`Missing required path parameter: ${name}`)
    }
  }

  return { pathParams, queryParams, bodyParams }
} 