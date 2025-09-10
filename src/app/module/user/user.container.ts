import {container} from "tsyringe"
import {UserRepository} from "./repository/user.repository"
import {UserRepositoryImpl} from "./repository/impl/user.repository.impl"
import {UserService} from "./service/user.service"
import {UserServiceImpl} from "./service/user.service.impl"
import {UserControllerImpl} from "./controller/user.controller.impl"
import { UserController } from '@module/user/controller/user.controller'
import { ProfileRepository } from '@module/user/repository/profile.repository'
import { ProfileRepositoryImpl } from '@module/user/repository/impl/profile.repository.impl'

export async function registerUserModule() {
  container.register<UserRepository>("UserRepository", { useClass: UserRepositoryImpl })
  container.register<UserService>("UserService", { useClass: UserServiceImpl })
  container.register<UserController>("UserController", { useClass: UserControllerImpl })
  container.register<ProfileRepository>("ProfileRepository", { useClass: ProfileRepositoryImpl })
}
