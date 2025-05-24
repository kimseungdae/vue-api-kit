import { HttpMethod } from './types'
import { ResourceBuilder, ResourceDefinition } from './chainTypes'

export class ResourceBuilderImpl implements ResourceBuilder {
  private _path: string = ''
  private _methods: HttpMethod[] = []
  private _params: string[] = []
  private _queryParams: string[] = []

  path(path: string): ResourceBuilder {
    this._path = path.startsWith('/') ? path : `/${path}`
    return this
  }

  methods(...methods: HttpMethod[]): ResourceBuilder {
    this._methods = [...new Set(methods)] // 중복 제거
    return this
  }

  params(...params: string[]): ResourceBuilder {
    this._params = [...new Set(params)] // 중복 제거
    return this
  }

  queryParams(...params: string[]): ResourceBuilder {
    this._queryParams = [...new Set(params)] // 중복 제거
    return this
  }

  build(): ResourceDefinition {
    if (!this._path) {
      throw new Error('Path is required for resource definition')
    }
    if (this._methods.length === 0) {
      throw new Error('At least one HTTP method is required')
    }

    return {
      path: this._path,
      methods: this._methods,
      params: this._params.length > 0 ? this._params : undefined,
      queryParams: this._queryParams.length > 0 ? this._queryParams : undefined
    }
  }

  // 정적 팩토리 메서드
  static create(): ResourceBuilder {
    return new ResourceBuilderImpl()
  }
}

// 리소스 생성 헬퍼 함수들
export const defineResource = () => ResourceBuilderImpl.create()

export const defineGetResource = (path: string) =>
  ResourceBuilderImpl.create()
    .path(path)
    .methods('GET')

export const definePostResource = (path: string) =>
  ResourceBuilderImpl.create()
    .path(path)
    .methods('POST')

export const defineCrudResource = (path: string) =>
  ResourceBuilderImpl.create()
    .path(path)
    .methods('GET', 'POST', 'PUT', 'DELETE') 