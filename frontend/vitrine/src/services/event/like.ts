import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Event } from '@/types/eventInterfaces'
import * as yup from 'yup'

export const likeSchema = yup.object({}).required()

export default class LikeService extends ApiService<yup.InferType<typeof likeSchema>> {
  constructor(toast: ToastServiceMethods, eventId: Event['id']) {
    super(toast, `events/${eventId}/like/`, likeSchema, null, `api/events/${eventId}/like/`)
  }

  async like(): Promise<void> {
    await this.create({})
  }

  async unlike(): Promise<void> {
    await this.delete()
  }
}