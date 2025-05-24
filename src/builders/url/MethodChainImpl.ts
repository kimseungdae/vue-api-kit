import { UrlBuilder } from './UrlBuilder'
import { HttpMethod, UrlParams, QueryParams } from './types'
import { 
  ChainState, 
  ChainStep, 
  BaseChain,
  ResourceMap,
  ResourceSelectedChain,
  MethodSelectedChain,
  ParamsSelectedChain,
  QuerySelectedChain
} from './chainTypes'
import { ResourceValidator } from './validators'

export class MethodChainImpl implements BaseChain, ResourceSelectedChain, MethodSelectedChain, ParamsSelectedChain, QuerySelectedChain {
  private state: ChainState = {}
  
  constructor(
    private readonly urlBuilder: UrlBuilder,
    private readonly resources: ResourceMap,
    private readonly prevState?: ChainState
  ) {
    if (prevState) {
      this.state = { ...prevState }
    }
  }

  resource(name: string): ResourceSelectedChain {
    if (!this.resources[name]) {
      throw new Error(`Resource "${name}" not found`)
    }
    this.state.resource = name
    return new MethodChainImpl(this.urlBuilder, this.resources, this.state)
  }

  private methodHandler(method: HttpMethod): MethodSelectedChain {
    if (!this.state.resource) {
      throw new Error('Resource must be selected before setting HTTP method')
    }

    const resource = this.resources[this.state.resource]
    ResourceValidator.validateMethod(method, resource)

    this.state.method = method
    return new MethodChainImpl(this.urlBuilder, this.resources, this.state)
  }

  get(): MethodSelectedChain { return this.methodHandler('GET') }
  post(): MethodSelectedChain { return this.methodHandler('POST') }
  put(): MethodSelectedChain { return this.methodHandler('PUT') }
  delete(): MethodSelectedChain { return this.methodHandler('DELETE') }
  patch(): MethodSelectedChain { return this.methodHandler('PATCH') }

  withParams(params: UrlParams): ParamsSelectedChain {
    if (!this.state.resource || !this.state.method) {
      throw new Error('Resource and HTTP method must be selected before setting parameters')
    }

    const resource = this.resources[this.state.resource]
    ResourceValidator.validateParams(params, resource)

    this.state.params = params
    return new MethodChainImpl(this.urlBuilder, this.resources, this.state)
  }

  withQuery(query: QueryParams): QuerySelectedChain {
    if (!this.state.resource || !this.state.method) {
      throw new Error('Resource and HTTP method must be selected before setting query parameters')
    }

    const resource = this.resources[this.state.resource]
    ResourceValidator.validateQuery(query, resource)

    // 기존 쿼리 파라미터와 병합
    this.state.query = {
      ...this.state.query,
      ...query
    }
    
    return new MethodChainImpl(this.urlBuilder, this.resources, this.state)
  }

  build(): string {
    if (!this.state.resource || !this.state.method) {
      throw new Error('Resource and HTTP method must be selected before building URL')
    }

    const resource = this.resources[this.state.resource]
    
    // 최종 검증
    if (this.state.params || this.state.query) {
      ResourceValidator.validateAll(
        this.state.method,
        this.state.params || {},
        this.state.query || {},
        resource
      )
    }
    
    // URL 빌더 초기화
    this.urlBuilder.reset()
    
    // 리소스 경로 세그먼트 추가
    const pathSegments = resource.path.split('/').filter(Boolean)
    this.urlBuilder.addSegments(...pathSegments)
    
    // 파라미터 설정
    if (this.state.params) {
      this.urlBuilder.setParams(this.state.params)
    }
    
    // 쿼리 파라미터 설정
    if (this.state.query) {
      this.urlBuilder.queries(this.state.query)
    }
    
    return this.urlBuilder.build()
  }

  // 정적 팩토리 메서드
  static create(urlBuilder: UrlBuilder, resources: ResourceMap): BaseChain {
    return new MethodChainImpl(urlBuilder, resources)
  }
} 