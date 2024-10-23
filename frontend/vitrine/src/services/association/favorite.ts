import * as yup from 'yup'
import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Association, AssociationFavorite } from '@/types/associationInterfaces'


const favoriteResponseSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    logo: yup.string().required(),
    slug: yup.string().required(),
  })

const favoriteBodySchema = yup
  .object({
    association_id: yup.number()
  })

const favoriteSchema = yup.object({
  ...favoriteResponseSchema.fields,
  ...favoriteBodySchema.fields
  })

export default class FavoriteService extends ApiService<yup.InferType<typeof favoriteSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(
      toast,`associations/favorites/`,
      favoriteSchema,
      null,
      `api/associations/favorites/`)
  }

  async getFavorites(): Promise<AssociationFavorite[]> {
    const data = await this.getAll()
    return data.map((favorite) => this.converterSchemaToInterface(favorite)) as AssociationFavorite[]
  }

  async addFavorite(associationId: Association['id']): Promise<void> {
    const data = {
      association_id: associationId
    }
    await this.create(data, ['id', 'name', 'logo', 'slug'])
  }

  async removeFavorite(associationId: Association['id']): Promise<void> {
    await this.delete(associationId)
  }
}

