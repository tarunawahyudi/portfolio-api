import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { articles } from '@db/schema'
import { db } from '@db/index'

export type Article = InferSelectModel<typeof articles>
export type NewArticle = InferInsertModel<typeof articles>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _articleWithAuthorQuery = db.query.articles.findFirst({
  with: {
    user: {
      with: {
        profile: true,
      },
    },
  },
})

export type ArticleWithAuthor = NonNullable<Awaited<typeof _articleWithAuthorQuery>>
