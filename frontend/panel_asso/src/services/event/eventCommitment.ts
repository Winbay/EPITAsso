import { memberSchema } from '@/services/association/member'
import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '../apiService'
import type { Event } from '@/types/eventInterface'
import * as yup from 'yup'
import type { EventCommitment } from '@/types/eventInterfaces'

export const eventCommitmentSchema = yup.object({
  id: yup.number().required(),
  hours: yup.number().required(),
  member: memberSchema.required(),
}).required();

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

  async getEventCommitments(): Promise<EventCommitment[]> {
    const data = await this.getAll()
    return data.map((eventCommitment) => this.converterSchemaToInterface(eventCommitment))
  }

  protected converterSchemaToInterface(
    eventCommitment: yup.InferType<typeof eventCommitmentSchema>
  ): EventCommitment {
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
      },
    }
  }
}