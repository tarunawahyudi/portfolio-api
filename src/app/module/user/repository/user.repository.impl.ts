import { NewUser, User } from '@module/user/entity/user'
import {injectable} from "tsyringe"
import type {UserRepository} from "@module/user/repository/user.repository"
import { db } from '@db/index'
import { users } from '@db/schema'

@injectable()
export class UserRepositoryImpl implements UserRepository {

  async save(data: NewUser): Promise<User> {
    const [inserted] = await db
      .insert(users)
      .values(data)
      .returning()

    return inserted
  }
}
