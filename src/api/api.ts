import useAuthStore from '@/stores/authStore'

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: 'https://automoto-api.lemassonkenan5.workers.dev/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then(({ data }) => {
        const authStore = useAuthStore()
        authStore.accessToken = data.accessToken
        return data.accessToken as string
      })
      .catch((err) => {
        const authStore = useAuthStore()
        authStore.accessToken = null
        throw err
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined

    const isRefreshCall = config?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && config && !config._retry && !isRefreshCall) {
      config._retry = true

      try {
        const newToken = await refreshAccessToken()

        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`
          return api(config)
        }
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
