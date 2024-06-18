import type {
  Equipment,
  EquipmentCreation,
  EquipmentModification,
  EquipmentRequestCreation
} from '@/types/equipmentInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'
import { equipmentRequestSchema } from '@/services/equipment/equipmentRequest'
import { associationSchema } from '../association/association'

const equipmentSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  asso_owner: associationSchema.required(),
  quantity: yup.number().required(),
  equipment_request: equipmentRequestSchema,
  photo: yup.string().required()
})

export default class EquipmentService extends ApiService<yup.InferType<typeof equipmentSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, '/api/equipment/', equipmentSchema)
  }

  async createEquipment(equipment: EquipmentCreation): Promise<void> {
    await this.create(this.camelToSnake(equipment))
  }

  async getEquipments(): Promise<Equipment[]> {
    const data = await this.getAll()
    return data.map((equipment) => this.snakeToCamel(equipment))
  }

  async getEquipmentById(id: Equipment['id']): Promise<Equipment> {
    const data = await this.getById(id)
    return this.snakeToCamel(data)
  }

  async patchEquipment(equipment: EquipmentModification): Promise<void> {
    await this.patch(this.camelToSnake(equipment), equipment.id)
  }

  async deleteEquipment(id: Equipment['id']): Promise<void> {
    await this.delete(id)
  }

  async retrieveEquipment(id: Equipment['id']): Promise<void> {
    // Marque un matériel en "récupéré" (set le equipmentRequest à null quoi)
    await this.request<void>('post', `${this.basePath}${id}/retrieve`)
  }

  async borrowEquipment(
    id: Equipment['id'],
    equipmentRequest: EquipmentRequestCreation
  ): Promise<void> {
    await this.request<void>(
      'post',
      `${this.basePath}${id}/borrow`,
      this.camelToSnake(equipmentRequest)
    )
  }

  async getInvalidDates(id: Equipment['id']): Promise<number[][]> {
    // Renvoie la liste des timestamps [borrowingDate, dueDate] des demandes acceptées pour ce matériel
    return await this.request<number[][]>('get', `${this.basePath}${id}/invalid-dates`)
  }
}
