import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance'
}

@Entity({ name: 'work_experiences' })
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  jobTitle!: string

  @Column({ length: 200 })
  company!: string

  @Column({ length: 200, nullable: true })
  location?: string

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME
  })
  employmentType!: EmploymentType

  @Column('date')
  startDate!: Date

  @Column('date', { nullable: true })
  endDate?: Date

  @Column({ default: false })
  isCurrentJob!: boolean

  @Column('text')
  description!: string

  @Column('simple-array', { nullable: true })
  achievements?: string[]

  @Column('simple-array', { nullable: true })
  technologies?: string[]

  @Column({ length: 200, nullable: true })
  website?: string

  @Column({ nullable: true })
  logo?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'workExperiences', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
