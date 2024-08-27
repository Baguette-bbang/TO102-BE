import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('friendship')
@Unique(['userId1', 'userId2'])
export class Friendship {
  @PrimaryGeneratedColumn({ name: 'friendship_id' })
  friendshipId: number;

  @Column({ name: 'user_id1' })
  userId1: number;

  @Column({ name: 'user_id2' })
  userId2: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.friendships1)
  @JoinColumn({ name: 'user_id1' })
  user1: User;

  @ManyToOne(() => User, (user) => user.friendships2)
  @JoinColumn({ name: 'user_id2' })
  user2: User;
}
