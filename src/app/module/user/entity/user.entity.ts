import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({ length: 150 })
  name!: string

  @Column({ length: 150, unique: true })
  email!: string

  @Column({ name: 'password_hash' })
  passwordHash!: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  headline?: string

  @Column({ type: 'text', nullable: true })
  bio?: string

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relations
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios!: Portfolio[]

  @OneToMany(() => WorkExperience, (exp) => exp.user)
  workExperiences!: WorkExperience[]

  @OneToMany(() => Education, (edu) => edu.user)
  educations!: Education[]

  @OneToMany(() => NonFormalEducation, (nfe) => nfe.user)
  nonFormalEducations!: NonFormalEducation[]

  @OneToMany(() => Skill, (skill) => skill.user)
  skills!: Skill[]

  @OneToMany(() => Certificate, (cert) => cert.user)
  certificates!: Certificate[]

  @OneToMany(() => Award, (award) => award.user)
  awards!: Award[]

  @OneToMany(() => Article, (article) => article.user)
  articles!: Article[]

  @OneToMany(() => Customization, (custom) => custom.user)
  customizations!: Customization[]

  @OneToMany(() => Setting, (setting) => setting.user)
  settings!: Setting[]
}
