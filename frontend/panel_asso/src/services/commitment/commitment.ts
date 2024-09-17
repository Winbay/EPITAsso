import type { Association } from '@/types/associationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'
import { associationSchema } from '@/services/association/association'
import type { Commitment } from '@/types/commitmentInterface'

export const commitmentSchema = yup
  .object({
    id: yup.string().required(),
    association: associationSchema.required(),
    start_date: yup.date().required(),
    end_date: yup.date().required(),
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
    return data.map((user) => this.converterSchemaToInterface(user))
  }

  protected converterSchemaToInterface(commitment: yup.InferType<typeof commitmentSchema>): Commitment {
    return {
      id: commitment.id,
      association: commitment.association,
      startDate: commitment.start_date,
      endDate: commitment.end_date,
    }
  }
}
