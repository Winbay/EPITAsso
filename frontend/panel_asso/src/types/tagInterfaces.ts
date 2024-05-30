export interface Tag {
  id: number
  name: string
  backgroundColor: string | null
  textColor: string | null
}

export interface EventTag extends Tag {
}

export interface ArticleTag extends Tag {
}
