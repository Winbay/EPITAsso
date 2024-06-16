import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import type { Message } from '@/types/messageInterfaces'
import { associationSchema } from '@/services/association/association'
import { conversationSchema } from '@/services/messaging/conversation'
import { userSchema } from '@/services/user/user'

export const messageSchema = yup.object({
  id: yup.number().required(),
  conversation: conversationSchema,
  content: yup.string().required(),
  author: userSchema,
  association_sender: associationSchema,
  sent_at: yup.date().required()
}).required()

export default class MessageService extends ApiService<yup.InferType<typeof messageSchema>> {
  constructor(toast: ToastServiceMethods, conversationId: number) {
    super(toast, `/api/conversations/${conversationId}/messages/`, messageSchema)
  }

  async createMessage(message: Omit<Message, 'id'>): Promise<void> {
    const { conversation, author, associationSender, sentAt,...rest } = message
    const associationsInConversation = conversation.associationsInConversation.map(association => ({
      id: association.id,
      name: association.name,
      content: association.content,
      location: association.location,
      logo: association.logo
    }));

    const messageDataToValidate = {
      ...rest,
      conversation: {
        id: conversation.id,
        name: conversation.name,
        associations_in_conversation: associationsInConversation,
        last_sent_at: conversation.lastSentAt,
      },
      author: {
        id: author.id,
        login: author.login,
        first_name: author.firstName,
        last_name: author.lastName,
        school: author.school
      },
      association_sender: associationSender,
      sent_at: sentAt
    };

    await this.create(messageDataToValidate, ['id'])
  }

  async getMessages(limit: number, offset: number): Promise<Message[]> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
    const data = await this.getAllWithParams(params.toString())
    return data.map((message: yup.InferType<typeof messageSchema>) => this.converterSchemaToInterface(message))
  }

  // async getMessages(): Promise<Message[]> {
  //   const data = await this.getAll()
  //   return data.map((message: yup.InferType<typeof messageSchema>) => this.converterSchemaToInterface(message))
  // }

  protected converterSchemaToInterface(message: yup.InferType<typeof messageSchema>): Message {
    return {
      id: message.id,
      conversation: {
        id: message.conversation.id,
        name: message.conversation.name,
        associationsInConversation: message.conversation.associations_in_conversation.map((association) => ({
          id: association.id,
          name: association.name,
          content: association.content,
          location: association.location,
          logo: association.logo
        })),
        lastSentAt: message.conversation.last_sent_at,
      },
      content: message.content,
      author: {
        id: message.author.id,
        login: message.author.login,
        firstName: message.author.first_name,
        lastName: message.author.last_name,
        school: message.author.school
      },
      associationSender: message.association_sender,
      sentAt: message.sent_at
    }
  }
}
