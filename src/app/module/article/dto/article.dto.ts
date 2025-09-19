export type ArticleStatus = 'draft' | 'published' | 'deleted';

export interface CreateArticleRequest {
  userId: string;
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  status?: Extract<ArticleStatus, 'draft' | 'published'>;
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  content?: string;
  tags?: string[];
}

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  status: ArticleStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleThumbnailResponse {
  id: string;
  thumbnailUrl: string | null;
}
