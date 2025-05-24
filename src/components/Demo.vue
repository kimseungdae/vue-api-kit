<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">사용자 관리 데모</h1>

    <!-- 사용자 목록 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">사용자 목록</h2>
        <div class="flex gap-4">
          <select
            v-model="roleFilter"
            class="px-3 py-2 border rounded"
          >
            <option value="">전체</option>
            <option value="admin">관리자</option>
            <option value="user">일반 사용자</option>
          </select>
          <button
            @click="refetch"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        {{ error.message }}
      </div>

      <!-- 데이터 테이블 -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b text-left">ID</th>
              <th class="px-6 py-3 border-b text-left">이름</th>
              <th class="px-6 py-3 border-b text-left">이메일</th>
              <th class="px-6 py-3 border-b text-left">역할</th>
              <th class="px-6 py-3 border-b text-left">가입일</th>
              <th class="px-6 py-3 border-b text-left">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 border-b">{{ user.id }}</td>
              <td class="px-6 py-4 border-b">{{ user.name }}</td>
              <td class="px-6 py-4 border-b">{{ user.email }}</td>
              <td class="px-6 py-4 border-b">
                <span
                  :class="{
                    'px-2 py-1 rounded text-sm': true,
                    'bg-blue-100 text-blue-800': user.role === 'admin',
                    'bg-green-100 text-green-800': user.role === 'user'
                  }"
                >
                  {{ user.role === 'admin' ? '관리자' : '일반 사용자' }}
                </span>
              </td>
              <td class="px-6 py-4 border-b">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 border-b">
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 사용자 추가 폼 -->
    <div class="bg-white p-6 rounded-lg border">
      <h2 class="text-xl font-semibold mb-4">새 사용자 추가</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">이름</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">역할</label>
          <select
            v-model="form.role"
            class="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="admin">관리자</option>
            <option value="user">일반 사용자</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            :disabled="createLoading"
          >
            {{ createLoading ? '처리 중...' : '추가' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi, useMutation } from '../composables/useApi'
import type { User, GetUsersResponse } from '../api/schemas'

// 상태 관리
const roleFilter = ref('')
const form = ref({
  name: '',
  email: '',
  role: 'user' as const
})

// API 호출
const {
  data,
  error,
  loading,
  refetch
} = useApi<GetUsersResponse>('getUsers')

const users = computed(() => {
  if (!data.value) return []
  return roleFilter.value
    ? data.value.items.filter(user => user.role === roleFilter.value)
    : data.value.items
})

// 사용자 생성
const {
  loading: createLoading,
  error: createError,
  mutate: createUser
} = useMutation<User>('createUser')

// 사용자 삭제
const {
  loading: deleteLoading,
  error: deleteError,
  mutate: deleteUserMutation
} = useMutation('deleteUser')

// 폼 제출 처리
async function handleSubmit() {
  try {
    await createUser(form.value)
    form.value = {
      name: '',
      email: '',
      role: 'user'
    }
    refetch()
  } catch (err) {
    console.error('Failed:', err)
  }
}

// 사용자 삭제 처리
async function deleteUser(id: number) {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deleteUserMutation({ id })
    refetch()
  } catch (err) {
    console.error('Failed:', err)
  }
}
</script> 