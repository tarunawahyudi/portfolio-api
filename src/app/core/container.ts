import "reflect-metadata"
import {AppDataSource} from "@lib/datasource"
import {registerUserModule} from "@module/user/user.container"

export async function setupContainer() {
  await AppDataSource.initialize()
  await registerUserModule()
}
