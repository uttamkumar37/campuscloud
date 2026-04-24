import axios from 'axios'

import { API_BASE_URL } from './endpoints'
import { storage } from '../utils/storage'
import { showToast } from '../utils/toast'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken()
  const tenantId = storage.getTenantId()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth()
      showToast({
        title: 'Session expired',
        description: 'Please sign in again to continue.',
        tone: 'error',
      })
    }

    return Promise.reject(error)
  },
)
