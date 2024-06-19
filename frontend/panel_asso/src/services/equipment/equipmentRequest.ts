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

  async getRequestsReceived(): Promise<EquipmentRequest[]> {
    const data = await this.getAllCustom('received')
    return data.map((req) => this.snakeToCamel(req))
  }

  async getRequestsSent(): Promise<EquipmentRequest[]> {
    const data = await this.getAllCustom('sent')
    return data.map((req) => this.snakeToCamel(req))
  }

  async acceptRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>(
      'patch',
      `${this.basePath}${equipmentRequest.id}/accept`,
      equipmentRequest
    )
  }

  async refuseRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>(
      'patch',
      `${this.basePath}${equipmentRequest.id}/refuse`,
      equipmentRequest
    )
  }
}
