import ApiService from '@/services/apiService'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { EventMemberCommitment } from '@/types/commitmentInterface'
import * as yup from 'yup'
import type { Association } from '@/types/associationInterfaces'
import { memberSchema } from '@/services/association/member'
import { eventSchema } from '@/services/event/event'

export const CommitmentResumeEventsSchema = yup.object({
  id: yup.number().required(),
  member: memberSchema.required(),
  event: eventSchema.required(),
  hours: yup.number().required()
}).required()

export default class CommitmentResumeEventsService extends ApiService<
  yup.InferType<typeof CommitmentResumeEventsSchema>
> {
  constructor(toast: ToastServiceMethods, associationId: Association['id'], memberId: number) {
    super(
      toast,
      `associations/${associationId}/commitments/resume/${memberId}/`,
      CommitmentResumeEventsSchema,
      `api/associations/${associationId}/commitments/resume/${memberId}/`
    )
  }

  getCommitmentResumeEvents(): EventMemberCommitment[] {
    // const data = await this.getAll()
    // return data.map((commitmentResumeEvents) => this.converterSchemaToInterface(commitmentResumeEvents))
    return [
      {
        id: 1,
        member: {
          id: 1,
          login: 'john.doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'member',
          school: 'school'
        },
        event: {
          id: 1,
          name: 'event1',
          start_date: new Date(),
          end_date: new Date(),
          description: 'description',
          association: {
            id: 1,
            name: 'association',
            description: 'description',
            school: 'school',
            members: []
          }
        },
        hours: 5
      },
      {
        id: 2,
        member: {
          id: 1,
          login: 'john.doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'member',
          school: 'school'
        },
        event: {
          id: 2,
          name: 'event2',
          start_date: new Date(),
          end_date: new Date(),
          description: 'description',
          association: {
            id: 2,
            name: 'association',
            description: 'description',
            school: 'school',
            members: []
          }
        },
        hours: 5
      }
    ]
  }

  protected converterSchemaToInterface(
    commitmentResumeEvents: yup.InferType<typeof CommitmentResumeEventsSchema>
  ): EventMemberCommitment {
    return {
      id: commitmentResumeEvents.id,
      member: {
        id: commitmentResumeEvents.member.id,
        login: commitmentResumeEvents.member.login,
        firstName: commitmentResumeEvents.member.first_name,
        lastName: commitmentResumeEvents.member.last_name,
        role: commitmentResumeEvents.member.role,
        school: commitmentResumeEvents.member.school
      },
      event: commitmentResumeEvents.event,
      hours: commitmentResumeEvents.hours
    }
  }
}