import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Location } from './location.entity';
import { PostTag } from './post-tag.entity';
import { PostParticipationRequest } from './post-participation-request.entity';
import { PostParticipant } from './post-participant.entity';

@Entity('post')
export class Post {
  @ApiProperty({ description: '게시글 ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: '사용자 ID', example: 1 })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: '위치 ID', example: 1 })
  @Column({ name: 'location_id' })
  locationId: number;

  @ApiProperty({ description: '게시글 제목', example: 'NestJS 게시글 예제' })
  @Column({ name: 'title', length: 255 })
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '이것은 예제 게시글입니다.',
  })
  @Column({ name: 'content', type: 'text' })
  content: string;

  @ApiProperty({
    description: '썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @Column({ name: 'thumbnail', length: 255, nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: '생성 날짜',
    example: '2024-08-28T14:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: '수정 날짜',
    example: '2024-08-29T14:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '게시글 상태', example: 'active' })
  @Column({ name: 'status', length: 50 })
  status: string;

  @ApiProperty({
    description: '모임 날짜',
    example: '2024-09-01T14:00:00.000Z',
  })
  @Column({
    name: 'meeting_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  meetingDate: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location, (location) => location.posts)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];

  @OneToMany(() => PostParticipationRequest, (request) => request.post)
  participationRequests: PostParticipationRequest[];

  @OneToMany(() => PostParticipant, (participant) => participant.post)
  participants: PostParticipant[];
}
