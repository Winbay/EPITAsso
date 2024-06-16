import * as yup from 'yup'
import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '@/services/apiService'

export const userSchema = yup.object({
  id: yup.string().required(),
  login: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  school: yup.string().required()
})

export default class UserService extends ApiService<yup.InferType<typeof userSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, `/api/users`, userSchema)
  }

  async getUsers(): Promise<User[]> {
    const data = await this.getAll()
    return data.map((user) => this.converterSchemaToInterface(user))
  }

  protected converterSchemaToInterface(user: yup.InferType<typeof userSchema>): User {
    return {
      id: user.id,
      login: user.login,
      firstName: user.first_name,
      lastName: user.last_name,
      school: user.school
    }
  }
}