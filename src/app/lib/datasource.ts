import {DataSource} from "typeorm"
import {User} from "@module/user/entity/user.entity"
import { Certificate } from '@module/certificate/entity/certificate.entity'
import { PersonalInfo } from '@module/personal-info/entity/personal-info.entity'
import { Project } from '@module/project/entity/project.entity'
import { Skill } from '@module/skill/entity/skill.entity'
import { SocialMedia } from '@module/social-media/entity/social-media.entity'
import { Testimonial } from '@module/testimonial/entity/testimonial.entity'
import { Education } from '@module/education/entity/education.entity'
import { WorkExperience } from '@module/work-experience/entity/work-experience.entity'
import { BlogPost } from '@module/blog-post/entity/blog-post.entity'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER ?? "user",
  password: process.env.DB_PASS ?? "pass",
  database: process.env.DB_NAME ?? "dbname",
  entities: [
    User,
    BlogPost,
    Certificate,
    PersonalInfo,
    Project,
    Skill,
    SocialMedia,
    Testimonial,
    Education,
    WorkExperience
  ],
  synchronize: true,
})
