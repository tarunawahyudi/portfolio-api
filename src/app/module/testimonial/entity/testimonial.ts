import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { testimonials } from '@db/schema'

export type Testimonial = InferSelectModel<typeof testimonials>
export type NewTestimonial = InferInsertModel<typeof testimonials>
