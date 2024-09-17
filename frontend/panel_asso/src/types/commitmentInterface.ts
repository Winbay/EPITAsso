import type { Association, Member } from '@/types/associationInterfaces'
import type { Event } from '@/types/eventInterfaces'

export interface Commitment {
  id: number
  association: Association
  startDate: Date
  endDate: Date
}

export interface CommitmentResume {
  id: number
  login: string
  firstName: string
  lastName: string
  commitmentHours: number
  eventCommitmentHours: number
  totalHours: number
}

export interface EventMemberCommitment {
  id: number
  member: Omit<Member, 'id'>
  event: Omit<Event, 'id'>
  hours: number
}
