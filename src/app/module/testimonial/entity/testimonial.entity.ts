import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { PersonalInfo } from '@module/personal-info/entity/personal-info.entity'

@Entity({ name: 'testimonials' })
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 100 })
  clientName!: string

  @Column({ length: 100 })
  clientPosition!: string

  @Column({ length: 150 })
  clientCompany!: string

  @Column('text')
  content!: string

  @Column('int', { default: 5 })
  rating!: number

  @Column({ nullable: true })
  clientImage?: string

  @Column({ nullable: true })
  clientEmail?: string

  @Column({ nullable: true })
  clientLinkedIn?: string

  @Column({ length: 200, nullable: true })
  projectName?: string

  @Column('date', { nullable: true })
  projectDate?: Date

  @Column({ default: true })
  isPublished!: boolean

  @Column({ default: false })
  isFeatured!: boolean

  @Column({ default: 0 })
  sortOrder!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relations
  @ManyToOne(() => PersonalInfo, personalInfo => personalInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: PersonalInfo
}
