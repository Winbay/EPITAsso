import type { ArticleTag } from './tagInterfaces'

export interface Post {
  id: number
  title: string
  author: string
  content: string
  tags: ArticleTag[]

  // association: string
  // lastAuthor: string
  // createdAt: Date
  // updatedAt: Date
}

export interface ArticleCreation extends Omit<Post, 'id' | 'author'>{
}

export interface ArticleModification extends Post{
}
