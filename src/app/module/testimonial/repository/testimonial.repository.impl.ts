import { TestimonialRepository } from '@module/testimonial/repository/testimonial.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewTestimonial, Testimonial } from '@module/testimonial/entity/testimonial'
import { injectable } from 'tsyringe'
import { eq } from 'drizzle-orm'
import { testimonials } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'

@injectable()
export class TestimonialRepositoryImpl implements TestimonialRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Testimonial>> {
    const whereCondition = eq(testimonials.userId, userId)
    return paginate(db, testimonials, options, [], whereCondition)
  }

  async findById(id: string): Promise<Testimonial | null> {
    const row = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id)
    })

    return row ?? null
  }

  async save(data: NewTestimonial): Promise<Testimonial> {
    const [inserted] = await db
      .insert(testimonials)
      .values(data)
      .returning()

    return inserted
  }
}
