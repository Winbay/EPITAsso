import ApiService from '@/services/apiService'
import * as yup from 'yup'
import type { AuthenticationRefresh } from '@/types/authenticationInterface'

const authenticationRefreshSchema = yup.object({
  access: yup.string().required(),
  refresh: yup.string().required()
})

export default class AuthenticationRefreshService extends ApiService<
  yup.InferType<typeof authenticationRefreshSchema>
> {
  constructor() {
    // TODO
    super(null, '/api/auth/refresh', authenticationRefreshSchema, null, '/api/auth/refresh')
  }

  async refresh(refreshToken: string): Promise<AuthenticationRefresh> {
    return await this.create<yup.InferType<typeof authenticationRefreshSchema>>(
      {
        refresh: refreshToken
      },
      ['access']
    )
  }
}
