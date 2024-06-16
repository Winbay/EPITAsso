import * as yup from 'yup'
import type { Conversation } from '@/types/conversationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '@/services/apiService'
import { associationSchema } from '@/services/association/association'

const associationsSchema = yup.array().of(associationSchema).required()

export const conversationSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    associations_in_conversation: associationsSchema,
    last_sent_at: yup.date().transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : value
    }).required()
  })

export default class ConversationService extends ApiService<yup.InferType<typeof conversationSchema>> {
  constructor(toast: ToastServiceMethods, associationId: number) {
    const params = new URLSearchParams({ association_id: associationId.toString()});
    super(toast, `/api/conversations/`, conversationSchema, params.toString())
  }

  async createConversation(conversation: Omit<Conversation, 'id'>): Promise<void> {
    const { associationsInConversation, lastSentAt, ...rest } = conversation
    const associationsInConversationDataToValidate = associationsInConversation.map((association) => ({
      id: association.id,
      name: association.name,
      content: association.content,
      location: association.location,
      logo: association.logo
    }))

    const conversationDataToValidate = {
      ...rest,
      associations_in_conversation: associationsInConversationDataToValidate,
      last_sent_at: lastSentAt
    }
    await this.create(conversationDataToValidate, ['id'])
  }

  async getConversations(): Promise<Conversation[]> {
    const data = await this.getAll()
    return data.map((conversation) => this.converterSchemaToInterface(conversation)) as Conversation[]
  }

  async deleteConversation(id: Conversation['id']): Promise<void> {
    await this.delete(id)
  }

  protected converterSchemaToInterface(conversation: yup.InferType<typeof conversationSchema>): Conversation {
    return {
      id: conversation.id,
      name: conversation.name,
      associationsInConversation: conversation.associations_in_conversation.map((association) => ({
        id: association.id,
        name: association.name,
        content: association.content,
        location: association.location,
        logo: association.logo
      })),
      lastSentAt: new Date(conversation.last_sent_at),
    }
  }
}
