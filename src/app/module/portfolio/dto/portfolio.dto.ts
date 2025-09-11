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
