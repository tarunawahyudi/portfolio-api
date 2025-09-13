import { Elysia } from 'elysia'
import { registerUserRoutes } from '@module/user/user.route'
import { registerAuthRoutes } from '@module/auth/auth.route'
import { registerWorkerExperienceRoutes } from '@module/work-experience/work-experience.route'
import { registerPortfolioRoutes } from '@module/portfolio/portfolio.route'
import { registerEducationRoutes } from '@module/education/education.route'

export function ApplicationRoutes(app: Elysia) {
  return app
    .use(registerAuthRoutes)
    .use(registerUserRoutes)
    .use(registerPortfolioRoutes)
    .use(registerWorkerExperienceRoutes)
    .use(registerEducationRoutes)
}
