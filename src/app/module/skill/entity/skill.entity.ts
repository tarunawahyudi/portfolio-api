import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum SkillCategory {
  PROGRAMMING_LANGUAGE = 'programming_language',
  FRAMEWORK = 'framework',
  DATABASE = 'database',
  TOOL = 'tool',
  SOFT_SKILL = 'soft_skill',
  LANGUAGE = 'language',
  CERTIFICATION = 'certification',
  OTHER = 'other'
}

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

@Entity({ name: 'skills' })
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 100 })
  name!: string

  @Column({
    type: 'enum',
    enum: SkillCategory
  })
  category!: SkillCategory

  @Column({
    type: 'enum',
    enum: ProficiencyLevel,
    default: ProficiencyLevel.INTERMEDIATE
  })
  level!: ProficiencyLevel

  @Column('int', { default: 1 })
  yearsOfExperience!: number

  @Column({ nullable: true })
  icon?: string

  @Column({ length: 50, nullable: true })
  color?: string

  @Column({ default: false })
  isHighlighted!: boolean

  @Column({ default: 0 })
  sortOrder!: number

  @Column('text', { nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'skills', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
