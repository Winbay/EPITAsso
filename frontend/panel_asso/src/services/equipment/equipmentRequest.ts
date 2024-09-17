import type { EquipmentRequest } from '@/types/equipmentInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'

const userSchema = yup.object({
  id: yup.string().required(),
  login: yup.string().required()
})

const associationSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    logo: yup.string().required()
  })
  .required()

export const equipmentRequestSchema = yup.object({
  id: yup.number().required(),
  equipment_id: yup.number().required(),
  equipment_name: yup.string().required(),
  user_respo_owner: userSchema.notRequired(), // Can be null
  asso_borrower: associationSchema.required(),
  user_respo_borrower: userSchema.required(),
  borrowing_date: yup.number().required(),
  due_date: yup.number().required(),
  status: yup.string().oneOf(['waiting', 'accepted', 'refused']).required(),
  comment: yup.string() // Can be blank (empty string)
})

export default class EquipmentRequestService extends ApiService<
  yup.InferType<typeof equipmentRequestSchema>
> {
  constructor(toast: ToastServiceMethods) {
    super(toast, 'equipments/requests/', equipmentRequestSchema)
  }

  async getRequestsReceived(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: EquipmentRequest[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllCustomWithParams('received', params.toString())
    const equipments = results.map((equipment: yup.InferType<typeof equipmentRequestSchema>) =>
      this.converterSchemaToInterface(equipment)
    )
    return { ...rest, results: equipments.map((equipment) => this.snakeToCamel(equipment)) }
  }

  async getRequestsSent(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: EquipmentRequest[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllCustomWithParams('sent', params.toString())
    const equipments = results.map((equipment: yup.InferType<typeof equipmentRequestSchema>) =>
      this.converterSchemaToInterface(equipment)
    )
    return { ...rest, results: equipments.map((equipment) => this.snakeToCamel(equipment)) }
  }

  async acceptRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>(
      'patch',
      `${this.getFullPath()}${equipmentRequest.id}/accept`,
      equipmentRequest
    )
  }

  async refuseRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>(
      'patch',
      `${this.getFullPath()}${equipmentRequest.id}/refuse`,
      equipmentRequest
    )
  }
}
