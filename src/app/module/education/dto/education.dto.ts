export interface CreateEducationRequest {
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface EducationResponse {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface UpdateEducationRequest {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
