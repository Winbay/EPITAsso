import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from './apiService'
import type { Tag } from '@/types/tagInterfaces'

export const tagSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    background_color: yup.string().nullable().defined(),
    text_color: yup.string().nullable().defined()
  })
  .required()

export default class TagService extends ApiService<yup.InferType<typeof tagSchema>> {
  constructor(toast: ToastServiceMethods, from: 'events' | 'posts') {
    super(toast, `/api/${from}/tags/`, tagSchema)
  }

  async getTags(): Promise<Tag[]> {
    const data = await this.getAll()
    return data.map((event) => this.converterSchemaToInterface(event))
  }

  protected converterSchemaToInterface(tag: yup.InferType<typeof tagSchema>): Tag {
    return {
      id: tag.id,
      name: tag.name,
      backgroundColor: tag.background_color,
      textColor: tag.text_color
    }
  }
}
