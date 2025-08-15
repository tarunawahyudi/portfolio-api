import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum SocialMediaPlatform {
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  YOUTUBE = 'youtube',
  MEDIUM = 'medium',
  DRIBBBLE = 'dribbble',
  BEHANCE = 'behance',
  STACKOVERFLOW = 'stackoverflow',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  OTHER = 'other'
}

@Entity({ name: 'social_medias' })
export class SocialMedia {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    type: 'enum',
    enum: SocialMediaPlatform
  })
  platform!: SocialMediaPlatform

  @Column({ length: 100, nullable: true })
  customPlatformName?: string

  @Column({ length: 200 })
  url!: string

  @Column({ length: 100, nullable: true })
  username?: string

  @Column({ nullable: true })
  icon?: string

  @Column({ length: 50, nullable: true })
  color?: string

  @Column({ default: true })
  isActive!: boolean

  @Column({ default: false })
  showInHeader!: boolean

  @Column({ default: 0 })
  sortOrder!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne('PersonalInfo', 'socialMedias', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo!: any
}
