import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { EventCommitment } from '@/types/eventInterfaces'
import { memberSchema } from '@/services/association/member'
import * as yup from 'yup'

export const eventCommitmentUpdateBodySchema = yup.object().shape({
  id: yup.number().required(),
  hours: yup.number().required(),
}).required();

export const eventCommitmentUpdateResponseSchema = yup.object().shape({
  id: yup.number().required(),
  hours: yup.number().required(),
  member: memberSchema.required(),
}).required();


export default class EventCommitmentUpdateService extends ApiService<
  yup.InferType<typeof eventCommitmentUpdateBodySchema>
> {
  constructor(toast: ToastServiceMethods) {
    super(
      toast,
      `events/commitments/bulk-update/`,
      eventCommitmentUpdateBodySchema,
      null,
      `api/events/commitments/bulk-update/`
    )
  }

  async updateEventCommitment(eventCommitments: EventCommitment[]): Promise<void> {
    const data = eventCommitments.map((eventCommitment) => ({
      id: eventCommitment.id,
      hours: eventCommitment.hours,
    }))
    await this.bulkUpdate(data)
  }
}