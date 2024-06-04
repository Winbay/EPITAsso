import type { Conversation } from '@/types/conversationInterfaces'
import type { Association } from '@/types/associationInterfaces'

export interface MessageInterfaces {
    id: number;
    content: string;
    user_sender: string;
    sent_date: Date;
    conversation: Conversation;
    association: Association;
}