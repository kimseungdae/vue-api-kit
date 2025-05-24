import { HttpMethod, UrlParams, QueryParams } from './types'

// 리소스 정의 타입
export interface ResourceDefinition {
  path: string
  methods: HttpMethod[]
  params?: string[]
  queryParams?: string[]
}

// 리소스 맵 타입
export interface ResourceMap {
  [key: string]: ResourceDefinition
}

// 체인 상태 타입
export interface ChainState {
  resource?: string
  method?: HttpMethod
  params?: UrlParams
  query?: QueryParams
}

// 체인 단계 타입
export type ChainStep = 
  | 'initial'      // 초기 상태
  | 'resource'     // 리소스 선택됨
  | 'method'       // HTTP 메서드 선택됨
  | 'params'       // 파라미터 설정됨
  | 'query'        // 쿼리 파라미터 설정됨
  | 'final'        // 최종 상태

// 기본 체인 인터페이스
export interface BaseChain {
  resource(name: string): ResourceSelectedChain
  build(): string
}

// 리소스 선택 후 체인 인터페이스
export interface ResourceSelectedChain extends BaseChain {
  get(): MethodSelectedChain
  post(): MethodSelectedChain
  put(): MethodSelectedChain
  delete(): MethodSelectedChain
  patch(): MethodSelectedChain
}

// HTTP 메서드 선택 후 체인 인터페이스
export interface MethodSelectedChain extends BaseChain {
  withParams(params: UrlParams): ParamsSelectedChain
  withQuery(query: QueryParams): QuerySelectedChain
}

// 파라미터 설정 후 체인 인터페이스
export interface ParamsSelectedChain extends BaseChain {
  withQuery(query: QueryParams): QuerySelectedChain
}

// 쿼리 파라미터 설정 후 체인 인터페이스
export interface QuerySelectedChain extends BaseChain {
  withQuery(query: QueryParams): QuerySelectedChain
}

// 메서드 체인 타입
export type MethodChain<TStep extends ChainStep> = 
  TStep extends 'initial' ? BaseChain :
  TStep extends 'resource' ? ResourceSelectedChain :
  TStep extends 'method' ? MethodSelectedChain :
  TStep extends 'params' ? ParamsSelectedChain :
  TStep extends 'query' ? QuerySelectedChain :
  BaseChain

// 리소스 정의 빌더 인터페이스
export interface ResourceBuilder {
  path(path: string): ResourceBuilder
  methods(...methods: HttpMethod[]): ResourceBuilder
  params(...params: string[]): ResourceBuilder
  queryParams(...params: string[]): ResourceBuilder
  build(): ResourceDefinition
}

// URL 프리셋 노드 타입
export type UrlPresetNode = {
  [key: string]: string | null | UrlPresetNode
}

// 체인 노드 타입 (재귀적)
export type ChainNode<T extends UrlPresetNode> = {
  [K in keyof T]: T[K] extends string | null
    ? (param?: string | number) => ChainNode<T>
    : T[K] extends UrlPresetNode
      ? (param?: string | number) => ChainNode<T[K]>
      : never
} & { build: () => ChainResult }

// 프리셋 기반 체인 인터페이스
export interface PresetChain<T extends UrlPresetNode> {
  chain: ChainNode<T>
  build: () => string
}

// 체인 결과 타입
export type ChainResult = {
  path: string
  params: Record<string, string | number>
  query?: Record<string, any>
}

// URL 프리셋 설정 예시
export const urlPreset = {
  user: {
    byId: ':userId',
    posts: {
      byId: ':postId',
      comments: null
    }
  },
  auth: {
    login: null,
    logout: null
  }
} as const

// 프리셋 타입 추출
export type UrlPreset = typeof urlPreset 