import { api } from '@/api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useAuthStore = defineStore('auth_store', () => {
  const accessToken = ref<string | null>(null)

  async function tryRestoreSession() {
    try {
      const { data } = await api.post('/auth/refresh')
      accessToken.value = data.accessToken
    } catch {
      accessToken.value = null
    }
  }

  return {
    accessToken,
    tryRestoreSession,
  }
})

export default useAuthStore
