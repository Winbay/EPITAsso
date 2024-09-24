import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Commitment, CommitmentModification, MemberCommitment } from '@/types/commitmentInterface'
import { memberSchema } from '@/services/association/member'
import * as yup from 'yup'
import type { Association } from '@/types/associationInterfaces'
import { commitmentSchema } from '@/services/association/commitment'

export const memberCommitmentUpdateBodySchema = yup
  .object()
  .shape({
    id: yup.number().required(),
    hours: yup.number().required()
  })
  .required()

export const memberCommitmentUpdateResponseSchema = yup
  .object()
  .shape({
    id: yup.number().required(),
    hours: yup.number().required(),
    member: memberSchema.required()
  })
  .required()

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

  async updateMemberCommitment(memberCommitments: MemberCommitment[]): Promise<MemberCommitment[]> {
    const data = memberCommitments.map((memberCommitment) => ({
      id: memberCommitment.id,
      hours: memberCommitment.hours
    }))
    const results = await this.bulkUpdate<yup.InferType<typeof memberCommitmentUpdateResponseSchema>[]>(data)
    return results.map((memberCommitment) => this.converterSchemaToInterface(memberCommitment))
  }

  protected converterSchemaToInterface(
    memberCommitment: yup.InferType<typeof memberCommitmentUpdateResponseSchema>
  ): MemberCommitment {
    return {
      id: memberCommitment.id,
      hours: memberCommitment.hours,
      member: {
        id: memberCommitment.member.id,
        login: memberCommitment.member.login,
        firstName: memberCommitment.member.first_name,
        lastName: memberCommitment.member.last_name,
        role: memberCommitment.member.role,
        school: memberCommitment.member.school
      }
    }
  }
}
