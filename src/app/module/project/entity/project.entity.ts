import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum ProjectStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PLANNED = 'planned',
  ON_HOLD = 'on_hold'
}

export enum ProjectType {
  WEB_APPLICATION = 'web_application',
  MOBILE_APPLICATION = 'mobile_application',
  DESKTOP_APPLICATION = 'desktop_application',
  API = 'api',
  LIBRARY = 'library',
  OTHER = 'other'
}

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column('text')
  description!: string

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.WEB_APPLICATION
  })
  type!: ProjectType

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.COMPLETED
  })
  status!: ProjectStatus

  @Column('simple-array')
  technologies!: string[]

  @Column({ nullable: true })
  repositoryUrl?: string

  @Column({ nullable: true })
  liveUrl?: string

  @Column('simple-array', { nullable: true })
  images?: string[]

  @Column('simple-array', { nullable: true })
  features?: string[]

  @Column('date', { nullable: true })
  startDate?: Date

  @Column('date', { nullable: true })
  endDate?: Date

  @Column({ length: 200, nullable: true })
  client?: string

  @Column('text', { nullable: true })
  challenges?: string

  @Column('text', { nullable: true })
  solutions?: string

  @Column('simple-array', { nullable: true })
  teamMembers?: string[]

  @Column({ length: 100, nullable: true })
  role?: string

  @Column({ default: false })
  isFeatured!: boolean

  @Column({ default: 0 })
  sortOrder!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'projects', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
