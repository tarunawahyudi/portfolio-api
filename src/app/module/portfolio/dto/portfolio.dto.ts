export interface PortfolioResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  techStack?: string[];
}

export interface CreatePortfolioRequest {
  userId: string;
  title: string;
  description?: string;
  techStack?: string[];
}

export interface UpdatePortfolioRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  techStack?: string[];
}

export interface PortfolioGalleryItemResponse {
  id: string;
  url: string | null;
  fileType: string | null;
  size: number | null;
  order: number | null;
}

export interface PortfolioDetailResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnailUrl: string | null;
  techStack: string[];
  gallery: PortfolioGalleryItemResponse[];
}
