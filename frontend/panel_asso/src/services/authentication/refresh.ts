import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '@/services/apiService'
import * as yup from 'yup'
import type { AuthenticationRefresh } from '@/types/authenticationInterface'

const authenticationRefreshSchema = yup
  .object({
    access: yup.string().required(),
    refresh: yup.string().required(),
  })

export default class AuthenticationRefreshService extends ApiService<yup.InferType<typeof authenticationRefreshSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, '/api/auth/refresh', authenticationRefreshSchema)
  }

  async refresh(refreshToken: string): Promise<AuthenticationRefresh> {
    return await this.create<yup.InferType<typeof authenticationRefreshSchema>>({
      refresh: refreshToken
    }, ['access'])
  }
}