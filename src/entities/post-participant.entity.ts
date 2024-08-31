import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('post_participant')
export class PostParticipant {
  @ApiProperty({ description: '참여자 ID' })
  @PrimaryGeneratedColumn({ name: 'participant_id' })
  participantId: number;

  @ApiProperty({ description: '게시글 ID' })
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: '사용자 ID' })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.participants)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.participations)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
