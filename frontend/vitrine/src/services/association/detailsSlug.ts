import type { AssociationDetail } from '@/types/associationInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'
import { socialNetworkSchema } from './socialNetwork'
import { faqSchema } from './faq'
import type {CustomToast} from "@/types/toastInterfaces";

const socialNetworksSchema = yup.array().of(socialNetworkSchema).required()
const faqsSchema = yup.array().of(faqSchema).required()

const associationDetailSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    content: yup.string().required(),
    location: yup.string().required(),
    logo: yup.string().required(),
    webhook: yup.string(),
    category: yup.string().defined(),
    slug: yup.string().required(),
    social_networks: socialNetworksSchema,
    faqs: faqsSchema
  })
  .required()

export default class AssociationDetailSlugService extends ApiService<
  yup.InferType<typeof associationDetailSchema>
> {
  constructor(toast: CustomToast, slug: string) {
    super(
      toast,
      `associations/slug/${slug}/`,
      associationDetailSchema,
      null,
      `api/associations/slug/${slug}/`
    )
  }

  async getAssociationDetail(): Promise<AssociationDetail> {
    const data = await this.get()
    return this.converterSchemaToInterface(data)
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
      webhook: associationDetails.webhook ?? '',
      category: associationDetails.category,
      slug: associationDetails.slug,
      socialNetworks: associationDetails.social_networks,
      faqs: associationDetails.faqs
    }
  }
}
