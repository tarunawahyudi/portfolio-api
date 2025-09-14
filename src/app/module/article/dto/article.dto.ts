export interface CreateArticleRequest {
  userId: string
  title: string
  slug: string
  content: string
  tags: string[]
  status?: string
}

export interface ArticleResponse {
  id: string;
  title: string
  slug: string
  content: string
  thumbnail: string
  tags: string[]
  status: string;
  publishedAt: string
}

export interface ArticleThumbnailResponse {
  id: string;
  thumbnailUrl: string;
}
