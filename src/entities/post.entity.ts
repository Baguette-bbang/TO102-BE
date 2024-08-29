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
import { User } from './user.entity';
import { Location } from './location.entity';
import { PostTag } from './post-tag.entity';
import { PostParticipationRequest } from './post-participant-request.entity';
import { PostParticipant } from './post-participant.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'thumbnail', length: 255, nullable: true })
  thumbnail: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'status', length: 50 })
  status: string;

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
