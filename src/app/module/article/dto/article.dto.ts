export type ArticleStatus = 'draft' | 'published' | 'deleted';

export interface CreateArticleRequest {
  userId: string;
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: Extract<ArticleStatus, 'draft' | 'published'>;
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  content?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  thumbnail: string | null;
  tags: string[];
  status: ArticleStatus;
  publishedAt: Date | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleThumbnailResponse {
  id: string;
  thumbnailUrl: string | null;
}
