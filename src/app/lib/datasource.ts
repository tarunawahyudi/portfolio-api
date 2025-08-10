import {DataSource} from "typeorm"
import {User} from "@module/user/entity/user"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER ?? "user",
  password: process.env.DB_PASS ?? "pass",
  database: process.env.DB_NAME ?? "dbname",
  entities: [User],
  synchronize: true,
})
