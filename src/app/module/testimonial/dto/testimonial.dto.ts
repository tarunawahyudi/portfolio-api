export interface CreateTestimonialRequest {
  userId: string;
  author: string;
  message: string;
}

export interface TestimonialResponse {
  author: string;
  message: string;
}
