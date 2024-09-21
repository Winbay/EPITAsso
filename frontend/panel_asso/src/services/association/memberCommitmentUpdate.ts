import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { CommitmentModification } from '@/types/commitmentInterface'
import { memberSchema } from '@/services/association/member'
import * as yup from 'yup'
import type { Association } from '@/types/associationInterfaces'

export const memberCommitmentUpdateBodySchema = yup.object().shape({
  id: yup.number().required(),
  hours: yup.number().required(),
}).required();

export const memberCommitmentUpdateResponseSchema = yup.object().shape({
  id: yup.number().required(),
  hours: yup.number().required(),
  member: memberSchema.required(),
}).required();


export default class MemberCommitmentUpdateService extends ApiService<
  yup.InferType<typeof memberCommitmentUpdateBodySchema>
> {
  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(
      toast,
      `associations/${associationId}/commitments/bulk-update/`,
      memberCommitmentUpdateBodySchema,
      null,
      `api/associations/${associationId}/commitments/bulk-update/`
    )
  }

  async updateMemberCommitment(memberCommitment: CommitmentModification[]): Promise<void> {
    await this.bulkUpdate(memberCommitment)
  }
}