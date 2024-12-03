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
    logo: yup.mixed<File>().required(),
    webhook: yup.string(),
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

  async patchAssociationDetail(associationDetail: AssociationDetail): Promise<void> {
    const formData = new FormData();

    formData.append("id", associationDetail.id.toString());
    formData.append("name", associationDetail.name);
    formData.append("content", associationDetail.content);
    formData.append("location", associationDetail.location);

    if (associationDetail.logo) {
      formData.append("logo", associationDetail.logo);
    }

    if (associationDetail.webhook) {
      formData.append("webhook", associationDetail.webhook);
    }

    associationDetail.socialNetworks.forEach((sn, index) => {
      formData.append(`social_networks[${index}][id]`, sn.id.toString());
      formData.append(`social_networks[${index}][name]`, sn.name);
      formData.append(`social_networks[${index}][link]`, sn.link);
    });

    associationDetail.faqs.forEach((faq, index) => {
      formData.append(`faqs[${index}][id]`, faq.id.toString());
      formData.append(`faqs[${index}][question]`, faq.question);
      formData.append(`faqs[${index}][answer]`, faq.answer);
    });

    await this.patchFormData(formData);
  }


  /**
   *
   * @param associationDetails
   */

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
      socialNetworks: associationDetails.social_networks,
      faqs: associationDetails.faqs
    }
  }
}
