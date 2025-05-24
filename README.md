# vue-api-kit

Vue 기반 프로젝트를 위한 확장 가능하고 안전한 API 호출 프레임워크입니다.  
스키마 기반 명세 → 자동 호출, 검증, 상태관리, 캐시, mock, 문서화까지 올인원으로 지원합니다!

<p align="center">
  <img src="https://img.shields.io/badge/vue-3.0.0-brightgreen.svg" alt="vue">
  <img src="https://img.shields.io/badge/typescript-5.0.0-blue.svg" alt="typescript">
  <img src="https://img.shields.io/badge/zod-3.0.0-red.svg" alt="zod">
</p>

## ✨ 주요 기능

- ✅ **Zod 기반 Schema-First API 명세**
  - 타입 안전성 보장
  - 런타임 검증 자동화
  - API 스펙 문서화 자동화

- ✅ **강력한 타입 추론**
  - 파라미터 타입 자동 추론
  - 응답 데이터 타입 자동 추론
  - 타입스크립트 완벽 지원

- ✅ **Vue Composition API 통합**
  - `useApi` - GET 요청 전용 훅
  - `useMutation` - POST/PUT/DELETE 요청 전용 훅
  - 자동 상태 관리 (loading, error, data)

- ✅ **고급 캐시 시스템**
  - TTL 기반 응답 캐싱
  - 세밀한 캐시 무효화 제어
  - 자동 캐시 정리

## ⚙️ 설치

```bash
# pnpm
pnpm add vue-api-kit zod msw @anatine/zod-mock

# npm
npm install vue-api-kit zod msw @anatine/zod-mock

# yarn
yarn add vue-api-kit zod msw @anatine/zod-mock
```

## 🚀 빠른 시작

1. API 스펙 정의:

```typescript
// apiMap.ts
import { z } from 'zod'

export const apiMap = {
  getUser: {
    method: 'GET',
    path: '/users/:id',
    description: '사용자 정보 조회',
    requestSchema: z.object({
      id: z.number()
    }),
    responseSchema: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string()
    })
  }
} as const
```

2. GET 요청 사용:

```typescript
import { useApi } from 'vue-api-kit'

// 컴포넌트 내부
const { data, loading, error, refetch } = useApi('getUser', {
  params: { id: 1 },
  ttl: 5000, // 5초 캐시
  immediate: true // 자동 실행
})
```

3. POST/PUT/DELETE 요청 사용:

```typescript
import { useMutation } from 'vue-api-kit'

// 컴포넌트 내부
const { mutate, loading, error, reset } = useMutation('createUser', {
  onSuccess: (data) => {
    console.log('사용자 생성 성공:', data)
  },
  onError: (error) => {
    console.error('사용자 생성 실패:', error)
  }
})

// 실행
await mutate({
  name: '김과장',
  email: 'kim@example.com'
})
```

## 🧱 아키텍처 개요

### API 명세 (apiMap)

- Zod 스키마 기반 API 정의
- 메서드, 경로, 파라미터, 응답 스키마 통합 관리
- 타입 안전성 + 런타임 검증 동시 제공

### 핵심 기능

1. **callApi**
   - 스키마 기반 안전한 API 호출
   - 자동 파라미터 검증
   - 응답 데이터 검증

2. **useApi**
   - GET 요청 전용 Composable
   - 자동 상태 관리
   - 캐시 시스템 통합

3. **useMutation**
   - POST/PUT/DELETE 요청 전용 Composable
   - 콜백 시스템 (onSuccess, onError)
   - 상태 초기화 기능

4. **캐시 시스템**
   - TTL 기반 응답 캐싱
   - 세밀한 캐시 무효화
   - 자동 캐시 정리

## 🔐 캐시 & 재시도

### 캐시 시스템

```typescript
// TTL 설정
const { data } = useApi('getUser', {
  params: { id: 1 },
  ttl: 5000 // 5초 캐시
})

// 캐시 무효화
import { invalidateCacheByKey } from 'vue-api-kit'
invalidateCacheByKey('getUser', { id: 1 })
```

### 향후 계획

- [ ] 지수 백오프 기반 자동 재시도
- [ ] 오프라인 모드 지원
- [ ] 캐시 영속화 옵션

## 📦 MSW & 문서화

### MSW 통합

```typescript
import { generateMSWHandlers } from 'vue-api-kit/mock'

const handlers = generateMSWHandlers(apiMap)
setupWorker(...handlers).start()
```

### 문서 자동화

```typescript
import { generateDocs } from 'vue-api-kit/docs'

// Markdown 문서 생성
generateDocs(apiMap) // → api.md 생성
```

## 🤝 기여하기

1. 이슈 등록 또는 PR 생성
2. 코드 리뷰 및 토론
3. 개선사항 반영

## 📝 라이선스

## 😎 제작자
Seungdae.kim 
kocacolla@gmail.com

MIT License © 2025 [vue-api-kit](https://github.com/yourusername/vue-api-kit)
