import { Article } from '@module/article/entity/article';
import { ArticleResponse } from '@module/article/dto/article.dto';
import { cdnUrl } from '@shared/util/common.util';

export function toArticleResponse(article: Article): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug ?? null,
    content: article.content ?? null,
    thumbnail: cdnUrl(article.thumbnail),
    tags: article.tags ?? [],
    status: article.status ?? 'draft',
    publishedAt: article.publishedAt,
    createdAt: article.createdAt!,
    updatedAt: article.updatedAt!,
  };
}
