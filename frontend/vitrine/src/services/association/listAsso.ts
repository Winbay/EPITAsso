import type { ToastServiceMethods } from 'primevue/toastservice'
import type {AssociationWithSN} from '@/types/associationInterfaces'
import {socialNetworkSchema} from "@/services/association/socialNetwork";
import * as yup from 'yup'
import ApiService from '../apiService'

const socialNetworksSchema = yup.array().of(socialNetworkSchema).required()

export const listAssociationSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  content: yup.string().required(),
  logo: yup.string().required(),
  slug: yup.string().required(),
  social_networks: socialNetworksSchema
})

export default class ListAssociationService extends ApiService<
  yup.InferType<typeof listAssociationSchema>
> {
  constructor(toast: ToastServiceMethods) {
    super(toast, 'associations/list', listAssociationSchema, null, `api/associations/list`)
  }

  async getAssociationsPagination(limit: number, offset: number)
    : Promise<{ count: number; next: string | null; previous: string | null; results: AssociationWithSN[]}> {
    const data = await this.getAllPagination(limit, offset)
    const assos: AssociationWithSN[] = data.results.map((ass) => this.snakeToCamel(ass)) as AssociationWithSN[]
    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: assos
    };
  }
}
