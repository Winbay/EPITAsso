import * as yup from 'yup'
import type { Conversation } from '@/types/conversationInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import ApiService from '@/services/apiService'

export const conversationSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    // Association ids is a must for create TODO: change that
    associations: yup.array().of(yup.number().required()).required(),
    last_sent_at: yup.date().transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : value
    }).required()
  })

export default class ConversationService extends ApiService<yup.InferType<typeof conversationSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, `conversations/`, conversationSchema)
  }

  async createConversation(conversation: Omit<Conversation, 'id' | 'lastSentAt'>): Promise<void> {
    console.log("conversation", conversation)
    const conversationDataToValidate = {
      name: conversation.name,
      associations: conversation.associationIds
    }
    await this.create(conversationDataToValidate, ['id', 'last_sent_at'])
  }

  async getConversations(): Promise<Conversation[]> {
    const data = await this.getAll()
    return data.map((conversation) => this.converterSchemaToInterface(conversation))
  }

  async deleteConversation(id: Conversation['id']): Promise<void> {
    await this.delete(id)
  }

  protected converterSchemaToInterface(conversation: yup.InferType<typeof conversationSchema>): Conversation {
    return {
      id: conversation.id,
      name: conversation.name,
      associationIds: conversation.associations,
      lastSentAt: new Date(conversation.last_sent_at),
    }
  }
}
