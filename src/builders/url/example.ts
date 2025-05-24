import { UrlBuilder } from './UrlBuilder'
import { UrlBuilderFactory } from './UrlBuilderFactory'
import { defineResource, defineGetResource, definePostResource, defineCrudResource } from './ResourceBuilder'
import { MethodChainImpl } from './MethodChainImpl'
import { ResourceMap } from './chainTypes'

// 리소스 정의
const resources: ResourceMap = {
  users: defineCrudResource('/users')
    .params('id')
    .queryParams('include', 'fields')
    .build(),
    
  userProfile: defineGetResource('/users/:id/profile')
    .params('id')
    .queryParams('fields')
    .build(),
    
  posts: defineResource()
    .path('/posts')
    .methods('GET', 'POST')
    .params('id', 'userId')
    .queryParams('page', 'limit', 'sort')
    .build(),
}

// URL 빌더 팩토리 설정
const factory = UrlBuilderFactory.getInstance()
factory.registerPreset('api', {
  baseUrl: 'https://api.example.com',
  version: '1',
  prefix: 'api'
})

// URL 빌더 생성
const urlBuilder = factory.create('api')

// 메서드 체인 생성
const chain = MethodChainImpl.create(urlBuilder, resources)

// 사용 예시
const examples = {
  // 사용자 목록 조회
  getUsersList: () => chain
    .resource('users')
    .get()
    .withQuery({ include: 'profile', fields: 'id,name,email' })
    .build(),
  
  // 특정 사용자 조회
  getUser: (id: string) => chain
    .resource('users')
    .get()
    .withParams({ id })
    .withQuery({ include: 'profile' })
    .build(),
  
  // 사용자 프로필 조회
  getUserProfile: (id: string) => chain
    .resource('userProfile')
    .get()
    .withParams({ id })
    .withQuery({ fields: 'avatar,bio' })
    .build(),
  
  // 게시글 목록 조회
  getPosts: () => chain
    .resource('posts')
    .get()
    .withQuery({ page: '1', limit: '10', sort: 'createdAt' })
    .build(),
  
  // 특정 사용자의 게시글 조회
  getUserPosts: (userId: string) => chain
    .resource('posts')
    .get()
    .withParams({ userId })
    .withQuery({ page: '1', limit: '10' })
    .build(),
}

// 결과 출력
console.log('Users List URL:', examples.getUsersList())
console.log('User Detail URL:', examples.getUser('123'))
console.log('User Profile URL:', examples.getUserProfile('123'))
console.log('Posts List URL:', examples.getPosts())
console.log('User Posts URL:', examples.getUserPosts('123')) 