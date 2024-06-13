import type { ToastServiceMethods } from 'primevue/toastservice'
import type { AssociationDetail } from '@/types/associationInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'
import { socialNetworkSchema } from './socialNetwork'
import { faqSchema } from './faq'
import { userSchema } from '@/services/user/user'

const membersSchema = yup.array().of(userSchema).required()
const socialNetworksSchema = yup.array().of(socialNetworkSchema).required()
const faqsSchema = yup.array().of(faqSchema).required()

const associationDetailSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    description: yup.string().required(),
    location: yup.string().required(),
    logo: yup.string().required(),
    members: membersSchema,
    social_networks: socialNetworksSchema,
    faq: faqsSchema
  })
  .required()

export default class AssociationDetailService extends ApiService<
  yup.InferType<typeof associationDetailSchema>
> {
  constructor(toast: ToastServiceMethods, associationId: number) {
    super(toast, `/api/associations/${associationId}/details/`, associationDetailSchema)
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
      description: associationDetails.description,
      location: associationDetails.location,
      logo: associationDetails.logo,
      members: associationDetails.members?.map((member) => ({
        id: member.id,
        login: member.login,
        firstName: member.first_name,
        lastName: member.last_name,
        school: member.school
      })),
      socialNetworks: associationDetails.social_networks,
      faq: associationDetails.faq,
    }
  }
}
