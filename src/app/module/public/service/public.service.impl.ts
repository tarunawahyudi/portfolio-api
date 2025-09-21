import { injectable, inject } from 'tsyringe'
import type { UserRepository } from '@module/user/repository/user.repository'
import { PublicProfileResponse } from '@module/public/dto/public.dto'
import {
  toSkillResponse,
  toWorkExperienceResponse,
  toEducationResponse,
  toPortfolioResponse,
  toCourseResponse,
  toAwardResponse,
  toArticleResponse,
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
        socials: profile?.socials ?? {},
        website: profile?.website ?? '',
        hobbies: profile?.hobbies ?? [],
        phoneNumber: profile?.phoneNumber ?? '',
        address: profile?.address ?? '',
      },
      skills: skills?.map(toSkillResponse) ?? [],
      experiences: workExperiences?.map(toWorkExperienceResponse) ?? [],
      educations: educations?.map(toEducationResponse) ?? [],
      portfolios: portfolios?.map(toPortfolioResponse) ?? [],
      courses: courses?.map(toCourseResponse) ?? [],
      awards: awards?.map(toAwardResponse) ?? [],
      articles: articles?.map(toArticleResponse) ?? [],
    }
  }
}
