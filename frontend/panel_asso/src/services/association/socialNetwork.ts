import type { Association, SocialNetwork } from '@/types/associationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'

export const socialNetworkSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  link: yup.string().required()
})

export default class SocialNetworkService extends ApiService<
  yup.InferType<typeof socialNetworkSchema>
> {
  associationId: Association['id']

  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(toast, `/api/associations/${associationId}/socialNetworks/`, socialNetworkSchema)
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
    await this.update(socialNetwork, socialNetwork.id)
  }

  async updateSocialNetworks(socialNetworks: SocialNetwork[]): Promise<void> {
    const socialNetworkItems = await this.getSocialNetworks()
    for (const socialNetworkItem of socialNetworkItems) {
      if (!socialNetworks.find((item) => item.id === socialNetworkItem.id)) {
        await this.deleteSocialNetwork(socialNetworkItem.id)
      }
    }
    for (const socialNetwork of socialNetworks) {
      if (socialNetwork.id !== -1) {
        await this.updateSocialNetwork(socialNetwork)
      } else {
        await this.createSocialNetwork(socialNetwork)
      }
    }
  }

  async deleteSocialNetwork(id: SocialNetwork['id']): Promise<void> {
    await this.delete(id)
  }
}
