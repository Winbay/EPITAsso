export interface EventModification {
  id: number
  title: string
  content: string
  author: string
  tags: number[]
  startDate: number
  endDate: number
  recurrent: boolean
  frequency: number
  endRecurrence: number
}

export interface EventCreation {
  title: string
  content: string
  tags: number[]
  startDate: number
  endDate: number
  recurrent: boolean
  frequency: number
  endRecurrence: number
}
