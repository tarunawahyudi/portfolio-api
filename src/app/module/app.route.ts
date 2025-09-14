import { Elysia } from 'elysia'
import { registerUserRoutes } from '@module/user/user.route'
import { registerAuthRoutes } from '@module/auth/auth.route'
import { registerWorkerExperienceRoutes } from '@module/work-experience/work-experience.route'
import { registerPortfolioRoutes } from '@module/portfolio/portfolio.route'
import { registerEducationRoutes } from '@module/education/education.route'
import { registerCertificateRoutes } from '@module/certificate/certificate.route'
import { registerSkillRoutes } from '@module/skill/skill.route'
import { registerAwardRoutes } from '@module/award/award.route'

export function ApplicationRoutes(app: Elysia) {
  return app
    .use(registerAuthRoutes)
    .use(registerUserRoutes)
    .use(registerPortfolioRoutes)
    .use(registerWorkerExperienceRoutes)
    .use(registerEducationRoutes)
    .use(registerCertificateRoutes)
    .use(registerSkillRoutes)
    .use(registerAwardRoutes)
}
