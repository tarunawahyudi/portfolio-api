export interface WorkExperienceResponse {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
}

export interface CreateWorkExperienceRequest {
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDescription?: string;
}
