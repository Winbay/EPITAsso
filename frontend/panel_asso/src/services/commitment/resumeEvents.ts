import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { EventMemberCommitment } from '@/types/commitmentInterface'
import * as yup from 'yup'
import type { Association } from '@/types/associationInterfaces'

export const CommitmentResumeEventsSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  hours: yup.number().required()
}).required()

export default class CommitmentResumeEventsService extends ApiService<
  yup.InferType<typeof CommitmentResumeEventsSchema>
> {
  constructor(toast: ToastServiceMethods, associationId: Association['id'], memberId: number) {
    super(
      toast,
      `associations/${associationId}/commitments/resume/${memberId}/`,
      CommitmentResumeEventsSchema,
      null,
      `api/associations/${associationId}/commitments/resume/${memberId}/`
    )
  }

  async getCommitmentResumeEvents(): Promise<EventMemberCommitment[]> {
    const data = await this.getAll()
    return data.map((commitmentResumeEvents) => this.converterSchemaToInterface(commitmentResumeEvents))
  }

  protected converterSchemaToInterface(
    commitmentResumeEvents: yup.InferType<typeof CommitmentResumeEventsSchema>
  ): EventMemberCommitment {
    return {
      id: commitmentResumeEvents.id,
      name: commitmentResumeEvents.name,
      hours: commitmentResumeEvents.hours
    }
  }
}