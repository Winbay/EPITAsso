import type { Association, Member } from '@/types/associationInterfaces'

interface User extends Pick<Member, 'id' | 'login'> {}

export interface Conversation {
  id: number
  name: string
  associationIds: Association['id'][]
  lastSentAt: Date
}

export interface ConversationCreation extends Omit<Conversation, 'id' | 'lastSentAt'> {}

export interface Message {
  id: number
  author: Omit<User, 'id'>
  conversationId: Conversation['id']
  content: string
  associationSender: Pick<Association, 'id' | 'name'>
  sentAt: Date
  updatedAt: Date | null
}

// TODO remove association_sender
export interface MessageCreation
  extends Omit<Message, 'id' | 'author' | 'conversationId' | 'sentAt'> {}
