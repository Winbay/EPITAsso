import type { EventTag } from '@/types/tagInterfaces';
import { ref } from 'vue'

export interface EventModification {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: number[];
  startDate: number;
  endDate: number;
  recurrent: boolean;
  frequency: number;
  endRecurrence: number;
}

export interface EventCreation {
  title: string;
  content: string;
  tags: EventTag[];
  startDate: number;
  endDate: number;
  recurrent: boolean;
  frequency: number;
  endRecurrence: number;
}