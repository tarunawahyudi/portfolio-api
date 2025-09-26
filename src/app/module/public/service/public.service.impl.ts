import { injectable, inject } from 'tsyringe'
import type { UserRepository } from '@module/user/repository/user.repository'
import {
  ContactEmailDto,
  PublicArticleDetailDto,
  PublicPortfolioItemDto,
  PublicProfileResponse,
} from '@module/public/dto/public.dto'
import {
  toSkillResponse,
  toWorkExperienceResponse,
  toEducationResponse,
  toCourseResponse,
  toAwardResponse,
  toPortfolioDetailResponse,
} from '@module/output/mapper'
import { AppException } from '@core/exception/app.exception'
import { cdnUrl } from '@shared/util/common.util'
import { PublicService } from '@module/public/service/public.service'
import { PdfService } from '@core/service/pdf.service'
import { PortfolioDetailResponse } from '@module/portfolio/dto/portfolio.dto'
import type { PortfolioRepository } from '@module/portfolio/repository/portfolio.repository'
import type { ArticleRepository } from '@module/article/repository/article.repository'
import { EmailService } from '@core/service/email.service'
import { verifyCaptcha } from '@lib/captcha'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { toPublicPortfolioItem } from '@module/public/mapper/public.mapper'

@injectable()
export class PublicServiceImpl implements PublicService {
  constructor(
    @inject('EmailService') private readonly emailService: EmailService,
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('PdfService') private readonly pdfService: PdfService,
    @inject('PortfolioRepository') private readonly portfolioRepository: PortfolioRepository,
    @inject('ArticleRepository') private readonly articleRepository: ArticleRepository,
  ) {}

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
        email: userData.email,
        fullName: profile?.fullName ?? userData.name,
        jobTitle: profile?.jobTitle ?? '',
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
          issueDate: cert.issueDate ?? '',
          credentialId: cert.credentialId ?? '',
          credentialUrl: cert.credentialUrl ?? '',
          certificateImage: cdnUrl(cert.certificateImage),
        }
      }),
      skills: skills?.map(toSkillResponse) ?? [],
      experiences: workExperiences?.map(toWorkExperienceResponse) ?? [],
      educations: educations?.map(toEducationResponse) ?? [],
      courses: courses?.map(toCourseResponse) ?? [],
      awards: awards?.map(toAwardResponse) ?? [],
    }
  }

  async generateCvAsPdf(username: string): Promise<Buffer> {
    const publicData = await this.getPublicProfile(username)
    return this.pdfService.generateCv(publicData)
  }

  async getPublicPortfolioDetail(id: string): Promise<PortfolioDetailResponse> {
    const portfolio = await this.portfolioRepository.findPublicById(id)
    if (!portfolio) {
      throw new AppException('PORTFOLIO-001', 'Portfolio not found or not public')
    }
    return toPortfolioDetailResponse(portfolio)
  }

  async getPublicArticleBySlug(slug: string): Promise<PublicArticleDetailDto> {
    const article = await this.articleRepository.findPublicBySlug(slug)
    if (!article) {
      throw new AppException('ARTICLE-001', 'Article not found or not published.')
    }

    return {
      title: article.title,
      slug: article.slug!,
      content: article.content ?? '',
      thumbnail: cdnUrl(article.thumbnail),
      tags: article.tags ?? [],
      publishedAt: article.publishedAt,
      author: {
        fullName: article.user.profile?.fullName ?? article.user.name,
        avatarUrl: cdnUrl(article.user.profile?.avatar),
      },
    }
  }

  async sendContactEmail(request: ContactEmailDto): Promise<void> {
    await verifyCaptcha(request.formData.captchaToken, request.clientIp)
    const user = await this.userRepository.findPublicProfileByUsername(request.username)
    if (!user) {
      throw new AppException('PROFILE-001', 'Profile not found or is private.')
    }

    await this.emailService.sendContactFormEmail({
      to: user.email,
      profileOwnerName: user.profile?.fullName ?? user.name,
      fromName: request.formData.name,
      fromEmail: request.formData.email,
      subject: request.formData.subject,
      message: request.formData.message,
    })
  }

  async getPublicPortfolios(
    username: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<PublicPortfolioItemDto>> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) throw new AppException('USER-002', 'User not found or not published.')

    const paginatedResult = await this.portfolioRepository.findAllPublicPortfolios(user.id, options)

    return {
      data: paginatedResult.data.map(toPublicPortfolioItem),
      pagination: paginatedResult.pagination,
    }
  }

  async getPortfolioCategories(username: string): Promise<string[]> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) throw new AppException('USER-002')
    return this.portfolioRepository.findUniqueCategoriesByUserId(user.id)
  }
}
