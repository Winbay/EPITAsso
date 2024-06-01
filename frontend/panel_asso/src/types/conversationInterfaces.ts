import type {MessageInterfaces} from "@/types/messageInterfaces";
import type {Association} from "@/types/associationInterfaces";

export interface Conversation {
    id: number;
    name: string;
    associations: Association[];
    messages: MessageInterfaces[];
}