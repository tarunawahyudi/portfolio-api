import {container} from "tsyringe"
import {Repository} from "typeorm"
import {User} from "./entity/user.entity"
import {UserRepository} from "./repository/user.repository"
import {UserRepositoryImpl} from "./repository/user.repository.impl"
import {UserService} from "./service/user.service"
import {UserServiceImpl} from "./service/user.service.impl"
import {UserControllerImpl} from "./controller/user.controller.impl"
import {AppDataSource} from "@lib/datasource"

export async function registerUserModule() {
  const typeormUserRepo = AppDataSource.getRepository(User)

  container.registerInstance(Repository<User>, typeormUserRepo)
  container.register<UserRepository>("UserRepository", { useClass: UserRepositoryImpl })
  container.register<UserService>("UserService", { useClass: UserServiceImpl })
  container.register("UserController", { useClass: UserControllerImpl })
}
