export interface PortfolioResponse {
  id: string;
  title: string;
  category: string;
  summary?: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface CreatePortfolioRequest {
  userId: string;
  title: string;
  category: string;
  status?: 'draft' | 'published' | 'archived';
  summary?: string;
  description?: string;
  techStack?: string[];
  projectUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
  visibility: 'public' | 'private';
  isFeatured: boolean;
  externalVideoUrl?: string;
}

export interface UpdatePortfolioRequest {
  title?: string;
  category?: string;
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private';
  isFeatured?: boolean;
  summary?: string;
  description?: string;
  techStack?: string[];
  projectUrl?: string;
  repoUrl?: string;
}

export interface PortfolioGalleryItemResponse {
  id: string;
  url: string | null;
  order: number | null;
}

export interface PortfolioDetailResponse extends PortfolioResponse {
  userId: string;
  description?: string;
  projectUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
  techStack: string[];
  publishedAt?: Date | null;
  visibility: 'public' | 'private';
  viewCount: number;
  externalVideoUrl?: string;
  selfHostedVideoUrl?: string;
  gallery: PortfolioGalleryItemResponse[];
}

export interface VisitorInfo {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}
