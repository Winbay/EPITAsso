import type { Event } from '@/types/eventInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'
import { tagSchema } from '../tag'
import type {CustomToast} from "@/types/toastInterfaces";

const tagsSchema = yup.array().of(tagSchema).required()

const associationInEventSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    logo: yup.string().required(),
    slug: yup.string().required()
  })

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
    end_recurrence: yup.date().required(),
    association: associationInEventSchema,
    like_count: yup.number().required(),
    is_liked_by_user: yup.boolean().required()
  })
  .required()

export default class EventService extends ApiService<yup.InferType<typeof eventSchema>> {
  constructor(toast: CustomToast) {
    super(toast, `events/`, eventSchema)
  }

  async createEvent(event: Omit<Event, 'id' | 'author' | 'likeCount' | 'isLikedByUser'>): Promise<void> {
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
    await this.create(eventDataToValidate, ['id', 'author', 'like_count', 'is_liked_by_user'])
  }

  async getEvents(): Promise<Event[]> {
    const data = await this.getAll()
    return data.map((event) => this.converterSchemaToInterface(event))
  }

  async getLastEvents(): Promise<Event[]> {
    const data = await this.getAllCustom('/api/events/upcoming/')
    return data.map((event) => this.converterSchemaToInterface(event))
  }

  async getEventById(id: Event['id']): Promise<Event> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data)
  }

  async getAssoEvents(slug: string): Promise<Event[]> {
    const data = await this.getAllCustom(`/api/associations/slug/${slug}/events`);
    return data.map((event) => this.converterSchemaToInterface(event));
  }

  async updateEvent(event: Event): Promise<void> {
    const { startDate, endDate, endRecurrence, tags, likeCount, isLikedByUser, ...rest } = event
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
      like_count : likeCount,
      is_liked_by_user : isLikedByUser,
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
      endRecurrence: event.end_recurrence,
      association: {
        id: event.association.id,
        name: event.association.name,
        logo: event.association.logo,
        slug: event.association.slug
      },
      likeCount: event.like_count,
      isLikedByUser: event.is_liked_by_user
    }
  }
}
