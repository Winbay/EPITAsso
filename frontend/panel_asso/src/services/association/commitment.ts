import * as yup from 'yup'
import { memberCommitmentUpdateResponseSchema } from '@/services/association/memberCommitmentUpdate'
import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Association } from '@/types/associationInterfaces'
import type { Commitment } from '@/types/commitmentInterface'

export const commitmentSchema = yup
  .object()
  .shape({
    id: yup.number().required(),
    start_date: yup.string().required(),
    end_date: yup.string().required(),
    member_commitments: yup.array().of(memberCommitmentUpdateResponseSchema).required()
  })
  .required()

export default class CommitmentService extends ApiService<yup.InferType<typeof commitmentSchema>> {
  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(
      toast,
      `associations/${associationId}/commitments/`,
      commitmentSchema,
      null,
      `api/associations/${associationId}/commitments/`
    )
  }

  async getCommitments(): Promise<Commitment[]> {
    const data = await this.getAll()
    return data.map((commitment) => this.converterSchemaToInterface(commitment))
  }

  async createCommitment(startDate: Date, endDate: Date): Promise<Commitment> {
    const data = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    }
    const result = await this.create<yup.InferType<typeof commitmentSchema>>(data, [
      'id',
      'member_commitments'
    ])
    return this.converterSchemaToInterface(result)
  }

  async deleteCommitment(commitmentId: number): Promise<void> {
    await this.delete(commitmentId)
  }

  protected converterSchemaToInterface(
    commitment: yup.InferType<typeof commitmentSchema>
  ): Commitment {
    return {
      id: commitment.id,
      startDate: commitment.start_date,
      endDate: commitment.end_date,
      memberCommitments: commitment.member_commitments.map((memberCommitment) => ({
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
      }))
    }
  }
}
