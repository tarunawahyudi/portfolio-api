export interface WorkExperienceResponse {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDesk?: string[];
}

export interface CreateWorkExperienceRequest {
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  jobDesk?: string[];
}

export type UpdateWorkExperienceRequest = {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  jobDesk?: string[];
};
