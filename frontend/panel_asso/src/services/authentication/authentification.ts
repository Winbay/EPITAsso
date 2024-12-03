import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import type { AuthenticationToken } from '@/types/authenticationInterface'

const authenticationTokenSchema = yup.object({
  access_token: yup.string().required(),
  expires_in: yup.number().required(),
  refresh_token: yup.string().required(),
  token_type: yup.string().required()
})

const authenticationCodeSchema = yup.object({
  code: yup.string().required(),
  redirect_uri: yup.string().required()
})

const authenticationSchema = yup.object({
  ...authenticationCodeSchema.fields,
  ...authenticationTokenSchema.fields
})

export default class AuthenticationService extends ApiService<
  yup.InferType<typeof authenticationSchema>
> {
  constructor(toast: ToastServiceMethods) {
    // TODO
    super(toast, '/api/auth/token', authenticationSchema, null, '/api/auth/token')
  }

  async getToken(code: string, redirect_uri: string): Promise<AuthenticationToken> {
    const data = await this.create<yup.InferType<typeof authenticationTokenSchema>>(
      { code: code, redirect_uri: redirect_uri },
      ['access_token', 'expires_in', 'refresh_token', 'token_type']
    )
    return this.converterSchemaToInterface(data)
  }

  protected converterSchemaToInterface(
    authentication: yup.InferType<typeof authenticationTokenSchema>
  ): AuthenticationToken {
    return {
      accessToken: authentication.access_token,
      expiresIn: authentication.expires_in,
      refreshToken: authentication.refresh_token,
      tokenType: authentication.token_type
    }
  }
}
