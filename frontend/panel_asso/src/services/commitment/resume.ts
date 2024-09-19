import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { CommitmentResume } from '@/types/commitmentInterface'
import * as yup from 'yup'
import type { Association } from '@/types/associationInterfaces'

export const commitmentResumeSchema = yup.object({
  id: yup.number().required(),
  login: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  commitment_hours: yup.number().required(),
  event_commitment_hours: yup.number().required(),
  total_hours: yup.number().required(),
}).required();

export default class CommitmentResumeService extends ApiService<
  yup.InferType<typeof commitmentResumeSchema>
> {
  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(
      toast,
      `associations/${associationId}/commitments/resume-all/`,
      commitmentResumeSchema,
      null,
      `api/associations/${associationId}/commitments/resume-all/`
    )
  }

  async getCommitmentsResume(startDate: Date | null, endDate: Date | null, login: string | null): Promise<CommitmentResume[]> {
    if (startDate === null && endDate === null) {
      const { results } = await this.getAll()
      return results.map((commitmentResume) => this.converterSchemaToInterface(commitmentResume));
    }

    const params = new URLSearchParams({ end_date: endDate.toISOString(), start_date: startDate.toISOString(), login: login ? login: ""  })
    const results = await this.getAllWithParams(params.toString())
    return results.map((commitmentResume) => this.converterSchemaToInterface(commitmentResume))
  }

  protected converterSchemaToInterface(
    commitmentResume: yup.InferType<typeof commitmentResumeSchema>
  ): CommitmentResume {
    return {
      id: commitmentResume.id,
      login: commitmentResume.login,
      firstName: commitmentResume.first_name,
      lastName: commitmentResume.last_name,
      commitmentHours: commitmentResume.commitment_hours,
      eventCommitmentHours: commitmentResume.event_commitment_hours,
      totalHours: commitmentResume.total_hours
    }
  }
}