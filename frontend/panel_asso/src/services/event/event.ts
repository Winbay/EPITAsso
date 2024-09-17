import type { Event } from '@/types/eventInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'
import { tagSchema } from '../tag'

const tagsSchema = yup.array().of(tagSchema).required()

const eventSchema = yup
  .object({
    id: yup.number().required(),
    author: yup.string().required(),
    name: yup.string().required(),
    content: yup.string().required(),
    tags: tagsSchema,
    start_date: yup.date().required(),
    end_date: yup.date().required(),
    recurrent: yup.boolean().required(),
    frequency: yup.number().required(),
    end_recurrence: yup.date().required()
  })
  .required()

export default class EventService extends ApiService<yup.InferType<typeof eventSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, `events/`, eventSchema)
  }

  async createEvent(event: Omit<Event, 'id' | 'author'>): Promise<void> {
    const { startDate, endDate, endRecurrence, tags, ...rest } = event
    const eventDataToValidate = {
      start_date: startDate,
      end_date: endDate,
      end_recurrence: endRecurrence,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        background_color: tag.backgroundColor,
        text_color: tag.textColor
      })),
      ...rest
    }
    await this.create(eventDataToValidate, ['id', 'author'])
  }

  async getEvents(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: Event[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllWithParams(params.toString())
    const events = results.map((event: yup.InferType<typeof eventSchema>) =>
      this.converterSchemaToInterface(event)
    )
    return { ...rest, results: events }
  }

  async getEventById(id: Event['id']): Promise<Event> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data)
  }

  async updateEvent(event: Event): Promise<void> {
    const { startDate, endDate, endRecurrence, tags, ...rest } = event
    const eventDataToValidate = {
      start_date: startDate,
      end_date: endDate,
      end_recurrence: endRecurrence,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        background_color: tag.backgroundColor,
        text_color: tag.textColor
      })),
      ...rest
    }
    await this.update(eventDataToValidate, eventDataToValidate.id)
  }

  async deleteEvent(id: Event['id']): Promise<void> {
    await this.delete(id)
  }

  async downloadEventPdf(id: Event['id']): Promise<string> {
    // Not implemented
    return 'test' + id
  }

  protected converterSchemaToInterface(event: yup.InferType<typeof eventSchema>): Event {
    return {
      id: event.id,
      author: event.author,
      name: event.name,
      content: event.content,
      tags: event.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        backgroundColor: tag.background_color,
        textColor: tag.text_color
      })),
      startDate: event.start_date,
      endDate: event.end_date,
      recurrent: event.recurrent,
      frequency: event.frequency,
      endRecurrence: event.end_recurrence
    }
  }
}
