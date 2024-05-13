import type { ArticleTag } from './tagInterfaces'

export interface ArticleCreation {
  title: string
  content: string
  tagIds: ArticleTag['id'][]
}

export interface ArticleModification extends ArticleCreation {
  id: number
  author: string
}
