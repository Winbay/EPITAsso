import type { Association, Member } from '@/types/associationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'

// TODO replace by Member (User) schema when it will be constructed
export const memberSchema = yup
  .object({
    id: yup.string().required(),
    login: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    role: yup.string().required(),
    school: yup.string().required()
  })
  .required()

export default class MemberService extends ApiService<yup.InferType<typeof memberSchema>> {
  associationId: Association['id']

  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(toast, `associations/${associationId}/members/`, memberSchema)
    this.associationId = associationId
  }

  async getMembers(): Promise<Member[]> {
    const data = await this.getAll()
    return data.map((user) => this.converterSchemaToInterface(user))
  }

  protected converterSchemaToInterface(member: yup.InferType<typeof memberSchema>): Member {
    return {
      id: member.id,
      login: member.login,
      firstName: member.first_name,
      lastName: member.last_name,
      role: member.role,
      school: member.school
    }
  }
}
