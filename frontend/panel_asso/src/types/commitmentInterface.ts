import type { Member } from '@/types/associationInterfaces'

export interface Commitment {
  id: number
  startDate: Date,
  endDate: Date,
  memberCommitments: MemberCommitment[]
}

export interface MemberCommitment {
  id: number
  hours: number
  member: Member
}

export interface CommitmentModification extends Omit<MemberCommitment, 'member'> {}

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
  name: string
  hours: number
}
