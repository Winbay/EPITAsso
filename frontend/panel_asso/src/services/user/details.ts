import * as yup from 'yup'
import type { UserDetail } from '@/types/userInterfaces'
import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'

const userDetailSchema = yup
  .object({
    id: yup.string().required(),
    login: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    school: yup.string().required(),
    email: yup.string().email().required(),
    isAdmin: yup.boolean()
  })

export default class UserDetailService extends ApiService<yup.InferType<typeof userDetailSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, '/api/users/me', userDetailSchema)
  }

  async getUser(): Promise<UserDetail> {
    const data = await this.get()
    return this.converterSchemaToInterface(data)
  }

  protected converterSchemaToInterface(user: yup.InferType<typeof userDetailSchema>): UserDetail {
    return {
      id: user.id,
      login: user.login,
      firstName: user.first_name,
      lastName: user.last_name,
      school: user.school,
      email: user.email,
      isAdmin: user.isAdmin
    }
  }
}