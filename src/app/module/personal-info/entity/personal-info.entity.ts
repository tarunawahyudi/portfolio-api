import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne, JoinColumn,
} from 'typeorm'
import { WorkExperience } from '@module/work-experience/entity/work-experience.entity'
import { Education } from '@module/education/entity/education.entity'
import { Project } from '@module/project/entity/project.entity'
import { Skill } from '@module/skill/entity/skill.entity'
import { Certificate } from '@module/certificate/entity/certificate.entity'
import { SocialMedia } from '@module/social-media/entity/social-media.entity'

@Entity({ name: 'personal_info' })
export class PersonalInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 100 })
  firstName!: string

  @Column({ length: 100 })
  lastName!: string

  @Column({ length: 200, unique: true })
  email!: string

  @Column({ length: 20, nullable: true })
  phone?: string

  @Column({ length: 200, nullable: true })
  address?: string

  @Column({ length: 100, nullable: true })
  city?: string

  @Column({ length: 100, nullable: true })
  country?: string

  @Column({ length: 10, nullable: true })
  postalCode?: string

  @Column({ length: 150 })
  jobTitle!: string

  @Column('text')
  summary!: string

  @Column({ nullable: true })
  profileImage?: string

  @Column({ nullable: true })
  website?: string

  @Column('date', { nullable: true })
  dateOfBirth?: Date

  @Column({ length: 100, nullable: true })
  nationality?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToOne('User', 'personalInfo')
  @JoinColumn({ name: 'user_id' })
  user!: any

  // Relations
  @OneToMany(() => WorkExperience, workExperience => workExperience.personalInfo)
  workExperiences!: WorkExperience[]

  @OneToMany(() => Education, education => education.personalInfo)
  educations!: Education[]

  @OneToMany(() => Project, project => project.personalInfo)
  projects!: Project[]

  @OneToMany(() => Skill, skill => skill.personalInfo)
  skills!: Skill[]

  @OneToMany(() => Certificate, certificate => certificate.personalInfo)
  certificates!: Certificate[]

  @OneToMany(() => SocialMedia, socialMedia => socialMedia.personalInfo)
  socialMedias!: SocialMedia[]
}
