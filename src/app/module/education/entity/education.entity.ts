import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum DegreeType {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma'
}

@Entity({ name: 'educations' })
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  institution!: string

  @Column({
    type: 'enum',
    enum: DegreeType
  })
  degreeType!: DegreeType

  @Column({ length: 200 })
  fieldOfStudy!: string

  @Column({ length: 200, nullable: true })
  location?: string

  @Column('date')
  startDate!: Date

  @Column('date', { nullable: true })
  endDate?: Date

  @Column({ default: false })
  isCurrentStudy!: boolean

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  gpa?: number

  @Column({ length: 10, nullable: true })
  gradeScale?: string // e.g., "4.0", "100"

  @Column('text', { nullable: true })
  description?: string

  @Column('simple-array', { nullable: true })
  coursework?: string[]

  @Column('simple-array', { nullable: true })
  honors?: string[]

  @Column({ nullable: true })
  logo?: string

  @Column({ length: 200, nullable: true })
  website?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'educations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
