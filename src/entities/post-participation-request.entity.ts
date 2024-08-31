import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('post_participation_request')
export class PostParticipationRequest {
  @ApiProperty({ description: '요청 ID(프라이머리 키)' })
  @PrimaryGeneratedColumn({ name: 'request_id' })
  requestId: number;

  @ApiProperty({ description: '게시글 ID' })
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: '요청자 ID' })
  @Column({ name: 'requester_id' })
  requesterId: number;

  @ApiProperty({ description: '수신자 ID' })
  @Column({ name: 'addressee_id' })
  addresseeId: number;

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
