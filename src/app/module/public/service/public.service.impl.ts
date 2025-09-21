import { injectable, inject } from 'tsyringe'
import type { UserRepository } from '@module/user/repository/user.repository'
import { PublicProfileResponse } from '@module/public/dto/public.dto'
import {
  toSkillResponse,
  toWorkExperienceResponse,
  toEducationResponse,
  toCourseResponse,
  toAwardResponse,
} from '@module/output/mapper'
import { AppException } from '@core/exception/app.exception'
import { cdnUrl } from '@shared/util/common.util'
import { PublicService } from '@module/public/service/public.service'

@injectable()
export class PublicServiceImpl implements PublicService {
  constructor(@inject('UserRepository') private readonly userRepository: UserRepository) {}

  async getPublicProfile(username: string): Promise<PublicProfileResponse> {
    const userWithRelations = await this.userRepository.findPublicProfileByUsername(username)

    if (!userWithRelations) {
      throw new AppException('PROFILE-001', 'Profile not found or is private')
    }

    const {
      profile,
      skills,
      workExperiences,
      educations,
      portfolios,
      courses,
      awards,
      certificates,
      articles,
      ...userData
    } = userWithRelations

    return {
      profile: {
        id: userData.id,
        fullName: profile?.fullName ?? userData.name,
        displayName: profile?.displayName ?? '',
        avatarUrl: cdnUrl(profile?.avatar),
        bio: profile?.bio ?? '',
        theme: 'modern',
        socials: profile?.socials ?? {},
        website: profile?.website ?? '',
        hobbies: profile?.hobbies ?? [],
        phoneNumber: profile?.phoneNumber ?? '',
        address: profile?.address ?? '',
      },
      articles: articles.map((article) => ({
        title: article.title,
        thumbnail: cdnUrl(article.thumbnail),
        tags: article.tags ?? [],
        slug: article.slug ?? null,
      })),
      portfolios: portfolios.map((portfolio) => ({
        id: portfolio.id,
        title: portfolio.title,
        category: portfolio.category,
        thumbnail: cdnUrl(portfolio.thumbnail),
        summary: portfolio.summary ?? null,
        repoUrl: portfolio.repoUrl ?? null,
        projectUrl: portfolio.projectUrl ?? null,
        techStack: portfolio.techStack ?? [],
      })),
      certificates: certificates.map((cert) => {
        const display = { ...cert.display }
        if (display.type === 'upload' && display.value) {
          display.value = cdnUrl(display.value) ?? ''
        }
        return {
          id: cert.id,
          title: cert.title,
          organization: cert.organization ?? '',
          display: display,
        }
      }),
      skills: skills?.map(toSkillResponse) ?? [],
      experiences: workExperiences?.map(toWorkExperienceResponse) ?? [],
      educations: educations?.map(toEducationResponse) ?? [],
      courses: courses?.map(toCourseResponse) ?? [],
      awards: awards?.map(toAwardResponse) ?? [],
    }
  }
}
