import type { Post } from '@/types/articleInterfaces'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'
import ApiService from '../apiService'
import { tagSchema } from '../tag'

const tagsSchema = yup.array().of(tagSchema).required()

const postSchema = yup
  .object({
    id: yup.number().required(),
    title: yup.string().required(),
    author: yup.string().required(),
    content: yup.string().required(),
    tags: tagsSchema
  })
  .required()

export default class PostService extends ApiService<yup.InferType<typeof postSchema>> {
  constructor(toast: ToastServiceMethods) {
    super(toast, `posts/`, postSchema)
  }

  async createPost(post: Omit<Post, 'id' | 'author'>): Promise<void> {
    const { tags, ...rest } = post
    const postDataToValidate = {
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        background_color: tag.backgroundColor,
        text_color: tag.textColor
      })),
      ...rest
    }
    await this.create(postDataToValidate, ['id', 'author'])
  }

  async getPosts(): Promise<Post[]> {
    const data = await this.getAll()
    return data.map((post) => this.converterSchemaToInterface(post))
  }

  async getPostById(id: number): Promise<Post> {
    const data = await this.getById(id)
    return this.converterSchemaToInterface(data)
  }

  async updatePost(post: Post): Promise<void> {
    const { tags, ...rest } = post
    const postDataToValidate = {
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        background_color: tag.backgroundColor,
        text_color: tag.textColor
      })),
      ...rest
    }
    await this.update(postDataToValidate, postDataToValidate.id)
  }

  async deletePost(postId: number): Promise<void> {
    await this.delete(postId)
  }

  protected converterSchemaToInterface(post: yup.InferType<typeof postSchema>): Post {
    return {
      id: post.id,
      title: post.title,
      author: post.author,
      content: post.content,
      tags: post.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        backgroundColor: tag.background_color,
        textColor: tag.text_color
      }))
    }
  }
}
