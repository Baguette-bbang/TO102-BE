import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_block')
export class UserBlock {
  @PrimaryGeneratedColumn({ name: 'block_id' })
  blockId: number;

  @Column({ name: 'blocker_id' })
  blockerId: number;

  @Column({ name: 'blocked_id' })
  blockedId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.blockedUsers)
  @JoinColumn({ name: 'blocker_id' })
  blocker: User;

  @ManyToOne(() => User, (user) => user.blockedByUsers)
  @JoinColumn({ name: 'blocked_id' })
  blocked: User;
}
