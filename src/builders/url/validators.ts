import { HttpMethod, UrlParams, QueryParams } from './types'
import { ResourceDefinition } from './chainTypes'

// HTTP 메서드 검증
export class HttpMethodValidator {
  static validate(method: HttpMethod, resource: ResourceDefinition): void {
    if (!resource.methods.includes(method)) {
      throw new Error(`Method "${method}" is not allowed for this resource. Allowed methods: ${resource.methods.join(', ')}`)
    }
  }

  static validateMethodExists(method: HttpMethod): void {
    const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    if (!validMethods.includes(method)) {
      throw new Error(`Invalid HTTP method: ${method}. Valid methods are: ${validMethods.join(', ')}`)
    }
  }
}

// URL 파라미터 검증
export class UrlParamsValidator {
  static validate(params: UrlParams, resource: ResourceDefinition): void {
    // 필수 파라미터 검증
    const requiredParams = this.extractRequiredParams(resource.path)
    const missingParams = requiredParams.filter(param => !(param in params))
    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`)
    }

    // 허용된 파라미터 검증
    if (resource.params) {
      const invalidParams = Object.keys(params).filter(param => !resource.params!.includes(param))
      if (invalidParams.length > 0) {
        throw new Error(`Invalid parameters: ${invalidParams.join(', ')}. Allowed parameters: ${resource.params.join(', ')}`)
      }
    }

    // 파라미터 값 검증
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        throw new Error(`Parameter "${key}" cannot be null or undefined`)
      }
      if (value === '') {
        throw new Error(`Parameter "${key}" cannot be empty`)
      }
    })
  }

  private static extractRequiredParams(path: string): string[] {
    const matches = path.match(/:[a-zA-Z][a-zA-Z0-9]*/g) || []
    return matches.map(param => param.slice(1))
  }
}

// 쿼리 파라미터 검증
export class QueryParamsValidator {
  static validate(query: QueryParams, resource: ResourceDefinition): void {
    if (!resource.queryParams) {
      if (Object.keys(query).length > 0) {
        throw new Error('Query parameters are not allowed for this resource')
      }
      return
    }

    // 허용된 쿼리 파라미터 검증
    const invalidParams = Object.keys(query).filter(param => !resource.queryParams!.includes(param))
    if (invalidParams.length > 0) {
      throw new Error(`Invalid query parameters: ${invalidParams.join(', ')}. Allowed parameters: ${resource.queryParams.join(', ')}`)
    }

    // 쿼리 파라미터 값 검증
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) {
        throw new Error(`Query parameter "${key}" cannot be undefined`)
      }
      if (Array.isArray(value) && value.length === 0) {
        throw new Error(`Query parameter "${key}" array cannot be empty`)
      }
    })
  }
}

// 통합 검증 유틸리티
export class ResourceValidator {
  static validateMethod(method: HttpMethod, resource: ResourceDefinition): void {
    HttpMethodValidator.validateMethodExists(method)
    HttpMethodValidator.validate(method, resource)
  }

  static validateParams(params: UrlParams, resource: ResourceDefinition): void {
    UrlParamsValidator.validate(params, resource)
  }

  static validateQuery(query: QueryParams, resource: ResourceDefinition): void {
    QueryParamsValidator.validate(query, resource)
  }

  static validateAll(method: HttpMethod, params: UrlParams, query: QueryParams, resource: ResourceDefinition): void {
    this.validateMethod(method, resource)
    this.validateParams(params, resource)
    this.validateQuery(query, resource)
  }
} 