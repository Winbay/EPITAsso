import type {EquipmentRequest} from '@/types/equipmentInterfaces';
import type {ToastServiceMethods} from 'primevue/toastservice';
import * as yup from 'yup';
import ApiService from '../apiService';
import {associationSchema} from '../association/association';
import {userSchema} from "@/services/user/user";

export const equipmentRequestSchema = yup
  .object({
    id: yup.number().required(),
    equipmentId: yup.number().required(),
    equipmentName: yup.string().required(),
    userRespoOwner: userSchema,  // Can be null
    assoBorrower: associationSchema.required(),
    userRespoBorrower: userSchema.required(),
    borrowingDate: yup.number().required(),
    dueDate: yup.number().required(),
    status: yup.string().oneOf(['waiting', 'accepted', 'refused']).required(),
    comment: yup.string().required()
  })

export default class EquipmentRequestService extends ApiService<yup.InferType<typeof equipmentRequestSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, '/api/equipment/requests/', equipmentRequestSchema);
  }

  async getRequestsReceived(): Promise<EquipmentRequest[]> {
    const data = await this.getAllCustom('received');
    return data.map((req) => this.snakeToCamel(req))
  }

  async getRequestsSent(): Promise<EquipmentRequest[]> {
    const data = await this.getAllCustom('sent');
    return data.map((req) => this.snakeToCamel(req))
  }

  async acceptRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>('post', `${this.basePath}${equipmentRequest.id}/accept`, equipmentRequest);
  }

  async refuseRequest(equipmentRequest: Pick<EquipmentRequest, 'id' | 'comment'>): Promise<void> {
    await this.request<void>('post', `${this.basePath}${equipmentRequest.id}/refuse`, equipmentRequest);
  }
}