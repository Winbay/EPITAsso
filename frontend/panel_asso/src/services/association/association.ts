import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Association } from '@/types/associationInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'

const associationSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  location: yup.string().required(),
  logo: yup.string().required()
})

export default class AssociationService extends ApiService<
  yup.InferType<typeof associationSchema>
> {
  constructor(toast: ToastServiceMethods) {
    super(toast, `/api/associations/`, associationSchema)
  }

  async getAssociations(): Promise<Association[]> {
    const data = await this.getAll()
    return data.map((ass) => this.converterSchemaToInterface(ass)) as Association[]
  }

  async getAssociationById(id: Association['id']): Promise<Association> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data) as Association
  }

  async updateAssociation(association: Association): Promise<void> {
    const { ...rest } = association
    await this.update(rest.id, rest)
  }
}
