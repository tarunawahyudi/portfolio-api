import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, length: 100 })
  email!: string

  @Column({ length: 255 })
  password!: string

  @Column({ default: true })
  isActive!: boolean

  @OneToOne('PersonalInfo', 'user', { cascade: true, eager: false })
  personalInfo!: any

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
