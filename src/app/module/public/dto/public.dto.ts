import {
  CertificateDisplay,
  SkillResponse,
  WorkExperienceResponse,
  EducationResponse,
  CourseResponse,
  AwardResponse,
} from '@module/output/dto'

export interface PublicProfileDto {
  id: string
  email: string;
  fullName: string
  jobTitle: string;
  displayName: string
  avatarUrl: string | null
  bio: string
  theme: string
  socials: Record<string, string>
  website: string
  hobbies: string[]
  phoneNumber: string
  address: string
}

export interface PublicArticleItemDto {
  title: string
  thumbnail: string | null
  tags: string[]
  slug: string | null
}

export interface PublicPortfolioItemDto {
  title: string
  category: string
  thumbnail: string | null
  summary: string | null
  repoUrl: string | null
  projectUrl: string | null
}

export interface PublicCertificateItemDto {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  display: CertificateDisplay;
  certificateImage: string | null
}

export interface PublicProfileResponse {
  profile: PublicProfileDto
  articles: PublicArticleItemDto[]
  portfolios: PublicPortfolioItemDto[]
  certificates: PublicCertificateItemDto[]
  skills: SkillResponse[]
  experiences: WorkExperienceResponse[]
  educations: EducationResponse[]
  courses: CourseResponse[]
  awards: AwardResponse[]
}

export interface PublicArticleAuthorDto {
  fullName: string;
  avatarUrl: string | null;
}

export interface PublicArticleDetailDto {
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  publishedAt: Date | null;
  author: PublicArticleAuthorDto;
}


interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactEmailDto {
  username: string;
  formData: ContactFormData
}
