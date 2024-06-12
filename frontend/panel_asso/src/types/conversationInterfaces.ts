import type {Association} from "@/types/associationInterfaces";

export interface Conversation {
    id: number;
    name: string;
    associationsInConversation: Association[];
    lastSentAt: Date;
}