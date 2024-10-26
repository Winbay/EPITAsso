import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Event } from '@/types/eventInterfaces'
import * as yup from 'yup'
import ApiService from '../apiService'
import type { Comment } from '@/types/commentInterfaces'

export const commentSchema = yup.object({
  id: yup.number().required(),
  login: yup.string().required(),
  content: yup.string().required(),
  publication_date: yup.string().required()
})

export default class CommentService extends ApiService<yup.InferType<typeof commentSchema>> {
  constructor(toast: ToastServiceMethods, eventId: Event['id']) {
    super(
      toast,
      `events/${eventId}/comments/`,
      commentSchema,
      null,
      `api/events/${eventId}/comments/`
    )
  }

  async getComments(
    limit: number,
    offset: number
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: Comment[]
  }> {
    const data = await this.getAllPagination(limit, offset)
    const comments: Comment[] = data.results.map((comment) =>
      this.snakeToCamel(comment)
    ) as Comment[]
    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: comments
    }
  }

  async createComment(comment: Comment['content']): Promise<Comment> {
    const result = await this.create({ content: comment }, ['id', 'login', 'publication_date'])
    return this.snakeToCamel(result)
  }

  async updateComment(comment: Comment): Promise<Comment> {
    const data = {
      content: comment.content
    }
    const result = await this.patch(data, comment.id, ['id', 'login', 'publication_date'])
    return this.snakeToCamel(result)
  }

  async deleteComment(commentId: Comment['id']): Promise<void> {
    await this.delete(commentId)
  }
}
