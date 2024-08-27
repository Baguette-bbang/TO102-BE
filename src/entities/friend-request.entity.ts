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

@Entity('friend_request')
@Unique(['requesterId', 'addresseeId'])
export class FriendRequest {
  @PrimaryGeneratedColumn({ name: 'request_id' })
  requestId: number;

  @Column({ name: 'requester_id' })
  requesterId: number;

  @Column({ name: 'addressee_id' })
  addresseeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;
}
