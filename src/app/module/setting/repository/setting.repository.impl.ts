import { SettingRepository } from '@module/setting/repository/setting.repository'
import { injectable } from 'tsyringe'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewSetting, Setting } from '@module/setting/entity/setting'
import { eq } from 'drizzle-orm'
import { settings } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'

@injectable()
export class SettingRepositoryImpl implements SettingRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Setting>> {
    const whereCondition = eq(settings.userId, userId)
    return paginate(db, settings, options, [], whereCondition)
  }

  async findById(id: number): Promise<Setting | null> {
    const row = await db.query.settings.findFirst({
      where: eq(settings.id, id)
    })

    return row ?? null
  }

  async save(userId: string, data: NewSetting): Promise<Setting> {
    const [inserted] = await db
      .insert(settings)
      .values({
        ...data,
        userId
      })
      .returning()

    return inserted
  }

}
