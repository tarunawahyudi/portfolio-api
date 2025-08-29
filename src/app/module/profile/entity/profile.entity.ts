import { User } from '@module/user/entity/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'text', nullable: true })
  address?: string

  @Column({ nullable: true })
  website?: string

  @Column({ nullable: true })
  linkedin?: string

  @Column({ nullable: true })
  github?: string

  @Column({ nullable: true })
  twitter?: string

  @Column({ type: 'jsonb', nullable: true })
  otherLinks?: Record<string, string>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
