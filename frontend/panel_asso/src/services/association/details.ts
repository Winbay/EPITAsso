import type { ToastServiceMethods } from 'primevue/toastservice'
import type { AssociationDetail } from '@/types/associationInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'
import { socialNetworkSchema } from './socialNetwork'
import { faqSchema } from './faq'

const socialNetworksSchema = yup.array().of(socialNetworkSchema).required()
const faqsSchema = yup.array().of(faqSchema).required()

const associationDetailSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    content: yup.string().required(),
    location: yup.string().required(),
    logo: yup.string().required(),
    social_networks: socialNetworksSchema,
    faqs: faqsSchema
  })
  .required()

export default class AssociationDetailService extends ApiService<
  yup.InferType<typeof associationDetailSchema>
> {
  constructor(toast: ToastServiceMethods, associationId: number) {
    super(
      toast,
      `associations/${associationId}/details/`,
      associationDetailSchema,
      null,
      `api/associations/${associationId}/details/`
    )
  }

  async getAssociationDetail(): Promise<AssociationDetail> {
    const data = await this.get()
    return this.converterSchemaToInterface(data)
  }

  /**
   *
   * @param associationDetail without members beacause they are update in another endpoint
   */
  async updateAssociationDetail(
    associationDetail: Omit<AssociationDetail, 'members'>
  ): Promise<void> {
    const data = {
      id: associationDetail.id,
      name: associationDetail.name,
      content: associationDetail.content,
      location: associationDetail.location,
      logo: associationDetail.logo,
      social_networks: associationDetail.socialNetworks,
      faqs: associationDetail.faqs
    }
    await this.update(data)
  }

  protected converterSchemaToInterface(
    associationDetails: yup.InferType<typeof associationDetailSchema>
  ): AssociationDetail {
    return {
      id: associationDetails.id,
      name: associationDetails.name,
      content: associationDetails.content,
      location: associationDetails.location,
      logo: associationDetails.logo,
      socialNetworks: associationDetails.social_networks,
      faqs: associationDetails.faqs
    }
  }
}
