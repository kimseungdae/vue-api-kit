// 스키마에서 생성된 기본 타입들 export
export * from '../schemas/user'

// 추가 유틸리티 타입들
import { PaginationRequest, SortRequest, SearchFilter } from '../schemas/common/base.schema'
import { UserBase } from '../schemas/user/listUsers.schema'

// 사용자 상태 타입
export type UserStatus = 'active' | 'inactive' | 'all'

// 사용자 역할 타입
export type UserRole = 'admin' | 'user' | 'all'

// 사용자 필터 타입 (재사용 가능한 형태)
export type UserFilter = {
  status?: UserStatus
  role?: UserRole
}

// 사용자 목록 조회 통합 파라미터 타입
export type UserListParams = PaginationRequest & SortRequest & SearchFilter & UserFilter

// 사용자 수정 요청 타입 (Partial을 활용한 선택적 업데이트)
export type UpdateUserRequest = Partial<Omit<UserBase, 'id' | 'createdAt'>> & {
  id: number // ID는 필수
}

// 사용자 삭제 응답 타입
export type DeleteUserResponse = {
  success: boolean
  message: string
  deletedId: number
} 