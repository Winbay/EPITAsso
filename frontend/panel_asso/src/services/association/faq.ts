import type { Association, Faq } from '@/types/associationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'

export const faqSchema = yup.object({
  id: yup.number().required(),
  question: yup.string().required(),
  answer: yup.string().required()
})

export default class FaqService extends ApiService<yup.InferType<typeof faqSchema>> {
  associationId: Association['id']

  constructor(toast: ToastServiceMethods, associationId: Association['id']) {
    super(toast, `/api/associations/${associationId}/faqs/`, faqSchema)
    this.associationId = associationId
  }

  async createFaq(faq: Omit<Faq, 'id'>): Promise<void> {
    await this.create(faq, ['id'])
  }

  async getFaqs(): Promise<Faq[]> {
    const data = await this.getAll()
    return data.map((faq) => this.converterSchemaToInterface(faq)) as Faq[]
  }

  async getFaqById(id: Faq['id']): Promise<Faq> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data) as Faq
  }

  async updateFaq(faq: Faq): Promise<void> {
    await this.update(faq.id, faq)
  }

  async updateFaqs(faqs: Faq[]): Promise<void> {
    const faqItems = await this.getFaqs();
    for (const faqItem of faqItems) {
      if (!faqs.find((item) => item.id === faqItem.id)) {
        await this.deleteFaq(faqItem.id);
      }
    }
    for (const faq of faqs) {
      if (faq.id !== -1) {
        await this.updateFaq(faq)
      } else {
        await this.createFaq(faq)
      }
    }
  }

  async deleteFaq(id: Faq['id']): Promise<void> {
    await this.delete(id)
  }
}
