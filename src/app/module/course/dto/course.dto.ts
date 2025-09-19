export interface CreateCourseRequest {
  userId: string;
  institution: string;
  courseName: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
}

export interface UpdateCourseRequest {
  institution?: string;
  courseName?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
}

export interface CourseResponse {
  id: string;
  institution: string;
  courseName: string;
  startDate: string;
  endDate: string | null;
  description: string;
}
