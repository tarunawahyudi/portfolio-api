import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { PersonalInfo } from '@module/personal-info/entity/personal-info.entity'

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity({ name: 'blog_posts' })
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column({ length: 250, unique: true })
  slug!: string

  @Column('text')
  excerpt!: string

  @Column('text')
  content!: string

  @Column({
    type: 'enum',
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT
  })
  status!: BlogPostStatus

  @Column({ nullable: true })
  featuredImage?: string

  @Column('simple-array', { nullable: true })
  tags?: string[]

  @Column('simple-array', { nullable: true })
  categories?: string[]

  @Column({ default: 0 })
  readTime!: number // in minutes

  @Column({ default: 0 })
  views!: number

  @Column({ default: false })
  isFeatured!: boolean

  @Column('date', { nullable: true })
  publishedAt?: Date

  @Column({ length: 200, nullable: true })
  metaTitle?: string

  @Column('text', { nullable: true })
  metaDescription?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relations
  @ManyToOne(() => PersonalInfo, personalInfo => personalInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: PersonalInfo
}
