export interface ArticleModification {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: number[];
}

export interface ArticleCreation {
  title: string;
  content: string;
  tags: number[];
}