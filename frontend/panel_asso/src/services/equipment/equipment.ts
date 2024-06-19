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

const associationSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    logo: yup.string().required()
  })
  .required()

const equipmentSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  asso_owner: associationSchema,
  quantity: yup.number().required(),
  equipment_request: equipmentRequestSchema.notRequired(),
  photo: yup.string().required()
})

export default class EquipmentService extends ApiService<yup.InferType<typeof equipmentSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, 'equipments/', equipmentSchema)
  }

  async createEquipment(equipment: EquipmentCreation): Promise<void> {
    const equipmentDataToValidate = this.camelToSnake(equipment)
    await this.create(equipmentDataToValidate, ['id', 'asso_owner', 'equipment_request'])
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
    await this.request<void>('patch', `${this.basePath}${id}/retrieve`)
  }

  // TODO: change that
  async borrowEquipment(
    id: Equipment['id'],
    equipmentRequest: EquipmentRequestCreation
  ): Promise<void> {
    const { borrowingDate, dueDate } = equipmentRequest
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
