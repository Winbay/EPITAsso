import type { Association, SocialNetwork } from '@/types/associationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'

const socialNetworkSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  link: yup.string().required()
})

export default class SocialNetworkService extends ApiService<
  yup.InferType<typeof socialNetworkSchema>
> {
  associationId: Association['id']

  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(toast, `/api/associations/${associationId}/socialNetworks`, socialNetworkSchema)
    this.associationId = associationId
  }

  async createSocialNetwork(socialNetwork: Omit<SocialNetwork, 'id'>): Promise<void> {
    await this.create(socialNetwork, ['id'])
  }

  async getSocialNetworks(): Promise<SocialNetwork[]> {
    const data = await this.getAll()
    return data.map((socialNetwork) =>
      this.converterSchemaToInterface(socialNetwork)
    ) as SocialNetwork[]
  }

  async getSocialNetworkById(id: SocialNetwork['id']): Promise<SocialNetwork> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data) as SocialNetwork
  }

  async updateSocialNetwork(socialNetwork: SocialNetwork): Promise<void> {
    await this.update(socialNetwork.id, socialNetwork)
  }

  async deleteSocialNetwork(id: SocialNetwork['id']): Promise<void> {
    await this.delete(id)
  }
}
