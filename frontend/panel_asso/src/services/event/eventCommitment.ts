import { memberSchema } from '@/services/association/member'
import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '../apiService'
import type { Event } from '@/types/eventInterfaces'
import * as yup from 'yup'
import type { MemberCommitment } from '@/types/commitmentInterface'

export const eventCommitmentSchema = yup
  .object({
    id: yup.number().required(),
    hours: yup.number().required(),
    member: memberSchema.required()
  })
  .required()

export default class EventCommitmentService extends ApiService<
  yup.InferType<typeof eventCommitmentSchema>
> {
  constructor(toast: ToastServiceMethods, eventId: Event['id']) {
    super(
      toast,
      `events/${eventId}/students-commitments/`,
      eventCommitmentSchema,
      null,
      `api/events/${eventId}/students-commitments/`
    )
  }

  async getEventCommitments(): Promise<MemberCommitment[]> {
    const data = await this.getAll()
    return data.map((eventCommitment) => this.converterSchemaToInterface(eventCommitment))
  }

  protected converterSchemaToInterface(
    eventCommitment: yup.InferType<typeof eventCommitmentSchema>
  ): MemberCommitment {
    return {
      id: eventCommitment.id,
      hours: eventCommitment.hours,
      member: {
        id: eventCommitment.member.id,
        login: eventCommitment.member.login,
        firstName: eventCommitment.member.first_name,
        lastName: eventCommitment.member.last_name,
        role: eventCommitment.member.role,
        school: eventCommitment.member.school
      }
    }
  }
}
