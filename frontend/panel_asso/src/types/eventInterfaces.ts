import type { EventTag } from './tagInterfaces'

export interface Event {
  id: number
  author: string
  name: string
  content: string
  tags: EventTag[]
  startDate: Date
  endDate: Date
  recurrent: boolean
  frequency: number
  endRecurrence: Date

  // association: Association
  // placesNumber: number
  // notes: undefined
  // staffMembers: undefined[]
  // otherAssociations: Association[]
  // tasks: undefined[]
}

export interface EventCreation extends Omit<Event, 'id' | 'author'> {}

export interface EventModification extends Event {}