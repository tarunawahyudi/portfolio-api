import "reflect-metadata"
import {registerUserModule} from "@module/user/user.container"

export async function setupContainer() {
  await registerUserModule()
}
