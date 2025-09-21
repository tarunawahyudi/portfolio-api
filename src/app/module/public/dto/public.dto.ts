import {
  ArticleResponse,
  AwardResponse,
  CourseResponse,
  EducationResponse,
  PortfolioResponse,
  SkillResponse,
  WorkExperienceResponse,
} from '@module/output/dto'

export interface PublicProfileDto {
  id: string;
  fullName: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  socials: Record<string, any>;
  website: string | null;
  hobbies: string[]
  phoneNumber: string;
  address: string;
}

export interface PublicProfileResponse {
  profile: PublicProfileDto;
  skills: SkillResponse[];
  experiences: WorkExperienceResponse[];
  educations: EducationResponse[];
  portfolios: PortfolioResponse[];
  courses: CourseResponse[];
  awards: AwardResponse[];
  articles: ArticleResponse[];
}
