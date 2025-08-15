import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column({ length: 150 })
  issuingOrganization!: string

  @Column('date')
  issueDate!: Date

  @Column('date', { nullable: true })
  expirationDate?: Date

  @Column({ nullable: true })
  credentialId?: string

  @Column({ nullable: true })
  credentialUrl?: string

  @Column('text', { nullable: true })
  description?: string

  @Column('simple-array', { nullable: true })
  skills?: string[]

  @Column({ nullable: true })
  logo?: string

  @Column({ default: false })
  doesNotExpire!: boolean

  @Column({ default: false })
  isVerified!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'certificates', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
