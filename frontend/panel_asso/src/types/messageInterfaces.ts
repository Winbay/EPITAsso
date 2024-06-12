import type { Conversation } from '@/types/conversationInterfaces'
import type { Association } from '@/types/associationInterfaces'
import type { User } from '@/types/userInterfaces'

export interface Message {
    id: number;
    conversation: Conversation;
    content: string;
    author: User;
    associationSender: Association;
    sentAt: Date;
}