import type { ToastServiceMethods } from 'primevue/toastservice';
import type { AssociationDetail } from '@/types/associationInterfaces'
import * as yup from 'yup';
import ApiService from '../apiService';
import AssociationService from './association';
import SocialNetworkService, { socialNetworkSchema } from './socialNetwork'
import FaqService, { faqSchema } from './faq'

const socialNetworksSchema = yup.array().of(socialNetworkSchema).required();
const faqsSchema = yup.array().of(faqSchema).required();

const associationDetailSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  location: yup.string().required(),
  logo: yup.string().required(),
  social_networks: socialNetworksSchema,
  faq: faqsSchema
}).required();

export default class AssociationDetailService extends ApiService<
  yup.InferType<typeof associationDetailSchema>
> {
  private associationService: AssociationService;
  private socialNetworkService: SocialNetworkService;
  private faqService: FaqService;

  constructor(toast: ToastServiceMethods, associationId: number) {
    super(toast, `/api/associations/`, associationDetailSchema);
    this.associationService = new AssociationService(toast);
    this.socialNetworkService = new SocialNetworkService(toast, associationId);
    this.faqService = new FaqService(toast, associationId);
  }

  async getAssociationDetail(id: AssociationDetail['id']): Promise<AssociationDetail> {
    const association = await this.associationService.getAssociationById(id);
    const socialNetworks = await this.socialNetworkService.getSocialNetworks();
    const faqs = await this.faqService.getFaqs();

    return this.converterSchemaToInterface({
      ...association,
      social_networks: socialNetworks,
      faq: faqs
    });
  }

  async updateAssociationDetail(association: AssociationDetail): Promise<void> {
    const { socialNetworks, faq, ...rest } = association;

    const associationDetailsDataToValidate = {
      ...rest,
      social_networks: socialNetworks,
      faq: faq
    };
    await this.update(association.id, associationDetailsDataToValidate);
  }

  protected converterSchemaToInterface(associationDetails: yup.InferType<typeof associationDetailSchema>): AssociationDetail {
    return {
      id: associationDetails.id,
      name: associationDetails.name,
      description: associationDetails.description,
      location: associationDetails.location,
      logo: associationDetails.logo,
      socialNetworks: associationDetails.social_networks?.map((socialNetwork) => ({
          id: socialNetwork.id,
          name: socialNetwork.name,
          link: socialNetwork.link
        })
      ),
      faq: associationDetails.faq?.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer
        })
      )
    };
  }
}
