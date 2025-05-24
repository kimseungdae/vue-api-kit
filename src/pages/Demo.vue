<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">vue-api-kit 데모</h1>

    <!-- 사용자 목록 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">사용자 목록 (useApi)</h2>
      <div class="flex gap-4 mb-4">
        <select v-model="userListParams.role" class="border p-2 rounded">
          <option value="">전체</option>
          <option value="admin">관리자</option>
          <option value="user">일반 사용자</option>
        </select>
        <button
          @click="refetchUsers"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>

      <div v-if="usersLoading" class="text-gray-500">로딩 중...</div>
      <div v-else-if="usersError" class="text-red-500">
        에러 발생: {{ usersError.message }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="user in usersData?.items"
          :key="user.id"
          class="border p-4 rounded shadow"
        >
          <div class="font-semibold">{{ user.name }}</div>
          <div class="text-gray-600">{{ user.email }}</div>
          <div class="text-sm">
            <span
              :class="{
                'bg-blue-100 text-blue-800': user.role === 'admin',
                'bg-gray-100 text-gray-800': user.role === 'user'
              }"
              class="px-2 py-1 rounded-full text-xs"
            >
              {{ user.role === 'admin' ? '관리자' : '일반 사용자' }}
            </span>
          </div>
          <div class="mt-2 flex gap-2">
            <button
              @click="() => handleEditUser(user)"
              class="text-blue-500 hover:text-blue-600"
            >
              수정
            </button>
            <button
              @click="() => handleDeleteUser(user.id)"
              class="text-red-500 hover:text-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 사용자 생성/수정 폼 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingUser ? '사용자 수정' : '새 사용자 생성' }} (useMutation)
      </h2>
      <form @submit.prevent="handleSubmit" class="max-w-md">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">이름</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border p-2 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">이메일</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border p-2 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">역할</label>
          <select v-model="form.role" class="w-full border p-2 rounded" required>
            <option value="admin">관리자</option>
            <option value="user">일반 사용자</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="mutationLoading"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ mutationLoading ? '처리 중...' : editingUser ? '수정' : '생성' }}
          </button>
          <button
            v-if="editingUser"
            type="button"
            @click="resetForm"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
      <div v-if="mutationError" class="mt-2 text-red-500">
        {{ mutationError.message }}
      </div>
    </div>

    <!-- 캐시 데모 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">캐시 데모</h2>
      <div class="flex gap-4">
        <button
          @click="invalidateAllCache"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          전체 캐시 삭제
        </button>
        <button
          @click="invalidateUsersCache"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          사용자 목록 캐시 삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useMutation } from '../composables/useMutation'
import { clearAllCache, invalidateCacheByKey } from '../core/cache'

// 사용자 목록 상태
const userListParams = reactive({
  role: ''
})

const {
  data: usersData,
  loading: usersLoading,
  error: usersError,
  refetch: refetchUsers
} = useApi('getUsers', {
  params: userListParams,
  immediate: true,
  watch: true,
  ttl: 5000 // 5초 캐시
})

// 폼 상태
const form = reactive({
  name: '',
  email: '',
  role: 'user'
})
const editingUser = ref<number | null>(null)

// Mutation 훅
const {
  mutate: createUser,
  loading: createLoading,
  error: createError
} = useMutation('createUser', {
  onSuccess: () => {
    resetForm()
    refetchUsers()
  }
})

const {
  mutate: updateUser,
  loading: updateLoading,
  error: updateError
} = useMutation('updateUser', {
  onSuccess: () => {
    resetForm()
    refetchUsers()
  }
})

const {
  mutate: deleteUser,
  loading: deleteLoading,
  error: deleteError
} = useMutation('deleteUser', {
  onSuccess: () => {
    refetchUsers()
  }
})

// 계산된 속성
const mutationLoading = computed(() => createLoading.value || updateLoading.value || deleteLoading.value)
const mutationError = computed(() => createError.value || updateError.value || deleteError.value)

// 메서드
const handleSubmit = async () => {
  try {
    if (editingUser.value) {
      await updateUser({
        id: editingUser.value,
        ...form
      })
    } else {
      await createUser(form)
    }
  } catch (error) {
    console.error('Failed:', error)
  }
}

const handleEditUser = (user: any) => {
  editingUser.value = user.id
  form.name = user.name
  form.email = user.email
  form.role = user.role
}

const handleDeleteUser = async (id: number) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await deleteUser({ id })
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }
}

const resetForm = () => {
  editingUser.value = null
  form.name = ''
  form.email = ''
  form.role = 'user'
}

// 캐시 관리
const invalidateAllCache = () => {
  clearAllCache()
  refetchUsers()
}

const invalidateUsersCache = () => {
  invalidateCacheByKey('getUsers', userListParams)
  refetchUsers()
}
</script> 