import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('post_participation_request')
export class PostParticipationRequest {
  @PrimaryGeneratedColumn({ name: 'request_id' })
  requestId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'requester_id' })
  requesterId: number;

  @Column({ name: 'addressee_id' })
  addresseeId: number;

  @Column({ name: 'status', type: 'boolean' })
  status: boolean;

  @ManyToOne(() => Post, (post) => post.participationRequests)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.sentParticipationRequests)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedParticipationRequests)
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;
}
