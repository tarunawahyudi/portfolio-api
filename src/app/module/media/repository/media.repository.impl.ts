import { injectable } from 'tsyringe'
import { db } from '@db/index'
import { media, portfolios } from '@db/schema'
import { eq, sql } from 'drizzle-orm'
import { MediaRepository } from '@module/media/repository/media.repository'
import { Media, NewMedia } from '@module/media/entity/media'

@injectable()
export class MediaRepositoryImpl implements MediaRepository {
  async create(data: NewMedia): Promise<Media> {
    const [inserted] = await db.insert(media).values(data).returning()
    return inserted
  }

  async findById(id: string): Promise<Media | null> {
    const row = await db.query.media.findFirst({
      where: eq(media.id, id)
    })

    return row ?? null
  }

  async delete(mediaId: string, userId: string, ownerType: 'portfolio'): Promise<Media | null> {
    const query = sql`
      DELETE
      FROM ${media}
      WHERE ${media.id} = ${mediaId}
        AND ${media.ownerId} IN (SELECT ${portfolios.id}
                                 FROM ${portfolios}
                                 WHERE ${portfolios.userId} = ${userId})
      RETURNING *`
    const result = await db.execute(query)
    return result.rows.length > 0 ? (result.rows[0] as Media) : null
  }
}
