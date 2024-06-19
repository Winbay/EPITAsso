import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import type { Message } from '@/types/conversationInterfaces'
import djangoApi from '../api'

const authorSchema = yup
  .object({
    id: yup.string().required(),
    login: yup.string().required()
  })
  .required()

const associationSchema = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required()
  })
  .required()

export const messageSchema = yup
  .object({
    id: yup.number().required(),
    author: authorSchema,
    conversation: yup.number().required(),
    content: yup.string().required(),
    association_sender: associationSchema,
    sent_at: yup.date().required()
  })
  .required()

interface PaginationResponse {
  count: number
  next: string | null
  previous: string | null
  results: yup.InferType<typeof messageSchema>[]
}

export default class MessageService extends ApiService<yup.InferType<typeof messageSchema>> {
  constructor(toast: ToastServiceMethods, conversationId: number) {
    super(toast, `conversations/${conversationId}/messages/`, messageSchema)
  }

  async createMessage(
    message: Omit<Message, 'id' | 'author' | 'conversationId' | 'sentAt' | 'associationSender'>
  ): Promise<Message> {
    const data = await this.create(message, [
      'id',
      'author',
      'conversation',
      'sent_at',
      'association_sender'
    ])
    if (!data) throw new Error('No created message returned')
    return this.converterSchemaToInterface(data as yup.InferType<typeof messageSchema>)
  }

  async getMessages(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    messages: Message[]
  }> {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
    const { results, ...rest } = await this.getAllWithParams(params.toString())
    const messages = results.map((message: yup.InferType<typeof messageSchema>) =>
      this.converterSchemaToInterface(message)
    )
    return { ...rest, messages }
  }

  // TODO Should be change !
  async getMessagesWithNext(next: string): Promise<{
    count: number
    next: string | null
    previous: string | null
    messages: Message[]
  }> {
    const { data } = await djangoApi.get<PaginationResponse>(next)
    const { results, ...rest } = data
    const messages = results.map((message: yup.InferType<typeof messageSchema>) =>
      this.converterSchemaToInterface(message)
    )
    return { ...rest, messages }
  }

  protected converterSchemaToInterface(message: yup.InferType<typeof messageSchema>): Message {
    return {
      id: message.id,
      conversationId: message.conversation,
      content: message.content,
      author: message.author,
      associationSender: message.association_sender,
      sentAt: message.sent_at
    }
  }
}
