import axios, { type AxiosInstance } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function createApiClient(token?: string | null): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 15_000,
  })

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const message =
        error.response?.data?.message ?? error.message ?? 'An unexpected error occurred'
      return Promise.reject(new Error(message))
    }
  )

  return instance
}

export const publicApi = createApiClient()
