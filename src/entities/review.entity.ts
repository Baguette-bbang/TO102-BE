import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  reviewId: number;

  @Column({ name: 'reviewer_id' })
  reviewerId: number;

  @Column({ name: 'reviewed_id' })
  reviewedId: number;

  @Column({ name: 'rating', type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.givenReviews)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  @JoinColumn({ name: 'reviewed_id' })
  reviewed: User;
}
