export interface CreateAwardRequest {
  userId: string;
  title: string;
  description?: string;
}

export interface UpdateAwardRequest {
  title?: string;
  description?: string;
}

export interface AwardResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
}
