import { UrlBuilderFactory } from './UrlBuilderFactory'
import { ResourceMap } from './chainTypes'
import { MethodChainImpl } from './MethodChainImpl'

// 타입 내보내기
export * from './types'
export * from './chainTypes'

// 클래스 내보내기
export { UrlBuilder } from './UrlBuilder'
export { UrlBuilderFactory } from './UrlBuilderFactory'
export { ResourceBuilderImpl, defineResource, defineGetResource, definePostResource, defineCrudResource } from './ResourceBuilder'
export { MethodChainImpl } from './MethodChainImpl'

// 기본 팩토리 인스턴스 export
export const urlBuilderFactory = UrlBuilderFactory.getInstance()

// 리소스 체인 생성 헬퍼 함수
export const createResourceChain = (preset: string, resources: ResourceMap) => {
  const urlBuilder = urlBuilderFactory.create(preset)
  return MethodChainImpl.create(urlBuilder, resources)
}

// 사용 예시:
/*
// 리소스 정의
const resources: ResourceMap = {
  users: defineCrudResource('/users')
    .params('id')
    .queryParams('include', 'fields')
    .build(),
}

// URL 빌더 팩토리 설정
urlBuilderFactory.registerPreset('api', {
  baseUrl: 'https://api.example.com',
  version: '1',
  prefix: 'api'
})

// 체인 생성 및 사용
const chain = createResourceChain('api', resources)
const url = chain
  .resource('users')
  .get()
  .withParams({ id: '123' })
  .withQuery({ include: 'profile' })
  .build()

// 결과: https://api.example.com/v1/api/users/123?include=profile
*/ 