import { User } from '@module/user/entity/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'work_experiences' })
export class WorkExperience {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @ManyToOne(() => User, (user) => user.workExperiences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column()
  company!: string

  @Column()
  position!: string

  @Column({ type: 'date' })
  startDate!: Date

  @Column({ type: 'date', nullable: true })
  endDate?: Date

  @Column({ default: false })
  isCurrent!: boolean

  @Column({ type: 'text', nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
