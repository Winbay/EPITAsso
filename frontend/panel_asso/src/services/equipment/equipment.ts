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
  photo: yup.mixed().notRequired()
})

export default class EquipmentService extends ApiService<yup.InferType<typeof equipmentSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, 'equipments/', equipmentSchema)
  }

  async createEquipment(equipment: EquipmentCreation): Promise<void> {
    const equipmentDataToValidate = this.camelToSnake(equipment)
    await this.createFormData(equipmentDataToValidate)
  }

  async getAssoEquipments(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: Equipment[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllCustomWithParams('stock', params.toString())
    const equipments = results.map((equipment: yup.InferType<typeof equipmentSchema>) =>
      this.converterSchemaToInterface(equipment)
    )
    return { ...rest, results: equipments.map((equipment) => this.snakeToCamel(equipment)) }
  }

  async getOtherAssoEquipments(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: Equipment[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllCustomWithParams('other', params.toString())
    const equipments = results.map((equipment: yup.InferType<typeof equipmentSchema>) =>
      this.converterSchemaToInterface(equipment)
    )
    return { ...rest, results: equipments.map((equipment) => this.snakeToCamel(equipment)) }
  }

  async getEquipmentById(id: Equipment['id']): Promise<Equipment> {
    const data = await this.getById(id)
    return this.snakeToCamel(data)
  }

  async patchEquipment(equipment: EquipmentModification): Promise<void> {
    const equipmentDataToValidate = this.camelToSnake(equipment)
    const formData = new FormData()
    for (const key in equipmentDataToValidate) {
      if (equipmentDataToValidate[key] !== null) {
        formData.append(key, equipmentDataToValidate[key])
      }
    }
    await this.patchFormData(formData, equipment.id)
  }

  async deleteEquipment(id: Equipment['id']): Promise<void> {
    await this.delete(id)
  }

  async retrieveEquipment(id: Equipment['id']): Promise<void> {
    // Marque un matériel en "récupéré" (set le equipmentRequest à null quoi)
    await this.request<void>('patch', `${this.getFullPath()}${id}/retrieve`)
  }

  // TODO: change that
  async borrowEquipment(
    id: Equipment['id'],
    equipmentRequest: EquipmentRequestCreation
  ): Promise<void> {
    await this.request<void>(
      'post',
      `${this.getFullPath()}${id}/borrow`,
      this.camelToSnake(equipmentRequest)
    )
  }

  async getInvalidDates(id: Equipment['id']): Promise<number[][]> {
    // Renvoie la liste des timestamps [borrowingDate, dueDate] des demandes acceptées pour ce matériel
    return await this.request<number[][]>('get', `${this.getFullPath()}${id}/invalid-dates`)
  }
}
