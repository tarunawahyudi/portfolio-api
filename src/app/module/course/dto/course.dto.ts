export interface CreateCourseRequest {
  userId: string;
  institution: string;
  courseName: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface CourseResponse {
  institution: string;
  courseName: string;
  startDate: string;
  endDate: string;
  description: string;
}
